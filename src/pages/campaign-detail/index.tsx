import React, { useMemo, useState } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import { useAppStore } from '@/store/useAppStore'
import CustomerCard from '@/components/CustomerCard'
import EmptyState from '@/components/EmptyState'
import dayjs from 'dayjs'
import styles from './index.module.scss'

type FilterTab = 'all' | 'valid' | 'unsubscribed' | 'sensitive'

export default function CampaignDetailPage() {
  const router = useRouter()
  const id = router.params.id as string
  const getCampaignById = useAppStore((s) => s.getCampaignById)
  const getFilteredCustomers = useAppStore((s) => s.getFilteredCustomers)
  const getFilterSummary = useAppStore((s) => s.getFilterSummary)
  const setExcludeSensitive = useAppStore((s) => s.setExcludeSensitive)
  const customers = useAppStore((s) => s.customers)
  const campaigns = useAppStore((s) => s.campaigns)

  const campaign = useMemo(() => getCampaignById(id), [id, campaigns, customers])
  const [showRefresh, setShowRefresh] = useState(false)
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  const { snapshotCustomers, excludedCustomers, sensitiveCustomers, validCustomers, hasExcluded } = useMemo(() => {
    if (!campaign) return { snapshotCustomers: [], excludedCustomers: [], sensitiveCustomers: [], validCustomers: [], hasExcluded: false }
    const snap = campaign.customerIds.map((cid) => customers.find((c) => c.id === cid)).filter(Boolean) as typeof customers
    const excluded = snap.filter((c) => c.unsubscribed)
    const sensitive = snap.filter((c) => c.isSensitive && !c.unsubscribed)
    const valid = snap.filter((c) => !c.unsubscribed && !c.isSensitive)
    return {
      snapshotCustomers: snap,
      excludedCustomers: excluded,
      sensitiveCustomers: sensitive,
      validCustomers: valid,
      hasExcluded: excluded.length > 0
    }
  }, [campaign, customers])

  const displayCustomers = useMemo(() => {
    switch (activeTab) {
      case 'valid': return validCustomers
      case 'unsubscribed': return excludedCustomers
      case 'sensitive': return sensitiveCustomers
      default: return snapshotCustomers
    }
  }, [activeTab, validCustomers, excludedCustomers, sensitiveCustomers, snapshotCustomers])

  const handleRefresh = () => {
    if (!campaign) return
    setShowRefresh(true)
  }

  const confirmRefresh = () => {
    if (!campaign) return
    const refreshed = getFilteredCustomers(campaign.excludeSensitive)
    const refreshedIds = refreshed.map((c) => c.id)
    const oldUnsub = excludedCustomers.map((c) => c.name).join('、')
    const logDetail = excludedCustomers.length > 0
      ? `移除退订: ${oldUnsub}，刷新后${refreshedIds.length}人`
      : `重新生成名单，${refreshedIds.length}人`

    const updatedCampaign = {
      ...campaign,
      customerIds: refreshedIds,
      audienceCount: refreshedIds.length,
      filterSummary: getFilterSummary(campaign.excludeSensitive),
      changeLog: [
        ...campaign.changeLog,
        { time: dayjs().format('YYYY-MM-DD HH:mm'), action: '刷新', detail: logDetail, count: refreshedIds.length }
      ]
    }

    const allCampaigns = useAppStore.getState().campaigns
    const rest = allCampaigns.filter((c) => c.id !== campaign.id)
    useAppStore.setState({ campaigns: [updatedCampaign, ...rest] })
    setExcludeSensitive(campaign.excludeSensitive)

    Taro.showToast({ title: '名单已刷新', icon: 'success' })
    setShowRefresh(false)
    setActiveTab('all')
  }

  const handleCustomerClick = (customerId: string) => {
    Taro.navigateTo({ url: `/pages/customer-detail/index?id=${customerId}` })
  }

  if (!campaign) {
    return (
      <View className={styles.container}>
        <EmptyState title='计划不存在' description='该计划可能已被删除' />
      </View>
    )
  }

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: '全部', count: snapshotCustomers.length },
    { key: 'valid', label: '有效', count: validCustomers.length },
    { key: 'unsubscribed', label: '已退订', count: excludedCustomers.length },
    { key: 'sensitive', label: '敏感', count: sensitiveCustomers.length }
  ]

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>{campaign.name}</Text>
        <View className={`${styles.statusBadge} ${styles[`status_${campaign.status}`]}`}>
          <Text>{campaign.statusName}</Text>
        </View>
      </View>

      <View className={styles.metaGrid}>
        <View className={styles.metaItem}>
          <Text className={styles.metaLabel}>受众人数</Text>
          <Text className={styles.metaValue}>{validCustomers.length} 人</Text>
        </View>
        <View className={styles.metaItem}>
          <Text className={styles.metaLabel}>排敏状态</Text>
          <Text className={`${styles.metaValue} ${campaign.excludeSensitive ? styles.metaValueActive : ''}`}>
            {campaign.excludeSensitive ? '已开启' : '未开启'}
          </Text>
        </View>
        <View className={styles.metaItem}>
          <Text className={styles.metaLabel}>创建时间</Text>
          <Text className={styles.metaValue}>{campaign.createdAt}</Text>
        </View>
        <View className={styles.metaItem}>
          <Text className={styles.metaLabel}>内容类型</Text>
          <Text className={styles.metaValue}>{campaign.contentType || '-'}</Text>
        </View>
      </View>

      <View className={styles.summaryCard}>
        <Text className={styles.summaryLabel}>筛选口径</Text>
        <Text className={styles.summaryText}>{campaign.filterSummary}</Text>
      </View>

      {hasExcluded && (
        <View className={styles.warningCard}>
          <View className={styles.warningIcon}>⚠️</View>
          <View className={styles.warningBody}>
            <Text className={styles.warningTitle}>名单中有 {excludedCustomers.length} 位客户已退订</Text>
            <Text className={styles.warningDesc}>这些客户已被自动排除，建议刷新名单使用最新口径</Text>
          </View>
          <View className={styles.refreshBtn} onClick={handleRefresh}>
            <Text>刷新</Text>
          </View>
        </View>
      )}

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>入选名单</Text>
        <Text className={styles.sectionSub}>快照 {snapshotCustomers.length} 人，有效 {validCustomers.length} 人</Text>
      </View>

      <View className={styles.tabBar}>
        {tabs.map((tab) => (
          <View
            key={tab.key}
            className={classnames(styles.tab, activeTab === tab.key && styles.tabActive)}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text>{tab.label}</Text>
            {tab.count > 0 && <Text className={styles.tabCount}>{tab.count}</Text>}
          </View>
        ))}
      </View>

      <ScrollView scrollY className={styles.listScroll}>
        {displayCustomers.length > 0 ? (
          displayCustomers.map((customer) => {
            const isExcl = customer.unsubscribed
            const isSens = customer.isSensitive && !customer.unsubscribed
            const customTags = customer.tags.filter((t) => t.type === 'custom')

            if (isExcl) {
              return (
                <View key={customer.id} className={styles.excludedCard} onClick={() => handleCustomerClick(customer.id)}>
                  <Image className={styles.excludedAvatar} src={customer.avatar} mode='aspectFill' />
                  <View className={styles.excludedInfo}>
                    <View className={styles.excludedNameRow}>
                      <Text className={styles.excludedName}>{customer.name}</Text>
                      <View className={styles.excludedBadge}><Text>已退订</Text></View>
                    </View>
                    <Text className={styles.excludedPhone}>{customer.phone}</Text>
                    <View className={styles.excludedTags}>
                      {customTags.length > 0 && customTags.map((tag) => (
                        <Text key={tag.id} className={styles.customTag} style={{ color: '#EC4899', borderColor: '#EC4899' }}>
                          {tag.name}
                        </Text>
                      ))}
                      {customer.tags.filter((t) => t.type !== 'custom').map((tag) => (
                        <Text key={tag.id} className={styles.excludedTag} style={{ color: tag.color, borderColor: tag.color }}>
                          {tag.name}
                        </Text>
                      ))}
                    </View>
                  </View>
                </View>
              )
            }

            return (
              <View key={customer.id} className={styles.customerItem}>
                <CustomerCard customer={customer} onClick={handleCustomerClick} />
                {isSens && (
                  <View className={styles.sensitiveStrip}>
                    <Text>敏感客户{campaign.excludeSensitive ? '（已排除）' : ''}</Text>
                  </View>
                )}
                {customTags.length > 0 && (
                  <View className={styles.customTagRow}>
                    {customTags.map((tag) => (
                      <Text key={tag.id} className={styles.customTag} style={{ color: tag.color, borderColor: tag.color }}>
                        {tag.name}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            )
          })
        ) : (
          <EmptyState title='暂无客户' description='该筛选条件下没有匹配客户' />
        )}
      </ScrollView>

      {campaign.changeLog.length > 0 && (
        <View className={styles.changeLogSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>变更记录</Text>
          </View>
          <View className={styles.logList}>
            {campaign.changeLog.map((entry, idx) => (
              <View key={idx} className={styles.logItem}>
                <View className={styles.logDot} />
                <View className={styles.logBody}>
                  <View className={styles.logHeader}>
                    <Text className={styles.logAction}>{entry.action}</Text>
                    <Text className={styles.logTime}>{entry.time}</Text>
                  </View>
                  <Text className={styles.logDetail}>{entry.detail}</Text>
                  <Text className={styles.logCount}>{entry.count} 人</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {showRefresh && (
        <View className={styles.confirmModal} onClick={() => setShowRefresh(false)}>
          <View className={styles.confirmContent} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.confirmTitle}>确认刷新名单？</Text>
            <Text className={styles.confirmDesc}>将使用当前最新筛选口径重新生成名单，原快照会被覆盖。</Text>
            <Text className={styles.confirmHint}>预计匹配 {getFilteredCustomers(campaign.excludeSensitive).length} 人</Text>
            <View className={styles.confirmActions}>
              <View className={styles.confirmCancel} onClick={() => setShowRefresh(false)}>
                <Text>取消</Text>
              </View>
              <View className={styles.confirmOk} onClick={confirmRefresh}>
                <Text>确认刷新</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
