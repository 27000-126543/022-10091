import React, { useMemo, useState } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { useAppStore } from '@/store/useAppStore'
import CustomerCard from '@/components/CustomerCard'
import EmptyState from '@/components/EmptyState'
import dayjs from 'dayjs'
import styles from './index.module.scss'

export default function CampaignDetailPage() {
  const router = useRouter()
  const id = router.params.id as string
  const getCampaignById = useAppStore((s) => s.getCampaignById)
  const getFilteredCustomers = useAppStore((s) => s.getFilteredCustomers)
  const getFilterSummary = useAppStore((s) => s.getFilterSummary)
  const setExcludeSensitive = useAppStore((s) => s.setExcludeSensitive)
  const customers = useAppStore((s) => s.customers)

  const campaign = useMemo(() => getCampaignById(id), [id, customers])
  const [showRefresh, setShowRefresh] = useState(false)

  const { snapshotCustomers, excludedCustomers, validCustomers, hasExcluded } = useMemo(() => {
    if (!campaign) return { snapshotCustomers: [], excludedCustomers: [], validCustomers: [], hasExcluded: false }
    const snap = campaign.customerIds.map((cid) => customers.find((c) => c.id === cid)).filter(Boolean) as typeof customers
    const excluded = snap.filter((c) => c.unsubscribed)
    const valid = snap.filter((c) => !c.unsubscribed)
    return {
      snapshotCustomers: snap,
      excludedCustomers: excluded,
      validCustomers: valid,
      hasExcluded: excluded.length > 0
    }
  }, [campaign, customers])

  const handleRefresh = () => {
    if (!campaign) return
    setShowRefresh(true)
  }

  const confirmRefresh = () => {
    if (!campaign) return
    const refreshed = getFilteredCustomers(campaign.excludeSensitive)
    const refreshedIds = refreshed.map((c) => c.id)

    const updatedCampaign = {
      ...campaign,
      customerIds: refreshedIds,
      audienceCount: refreshedIds.length,
      filterSummary: getFilterSummary(campaign.excludeSensitive),
      createdAt: dayjs().format('YYYY-MM-DD')
    }

    const allCampaigns = useAppStore.getState().campaigns
    const rest = allCampaigns.filter((c) => c.id !== campaign.id)
    useAppStore.setState({ campaigns: [updatedCampaign, ...rest] })
    setExcludeSensitive(campaign.excludeSensitive)

    Taro.showToast({ title: '名单已刷新', icon: 'success' })
    setShowRefresh(false)
    console.info('[Campaign] Refreshed:', updatedCampaign)
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
          <Text className={styles.metaValue}>{campaign.audienceCount} 人</Text>
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
            <Text className={styles.warningDesc}>这些客户将被自动排除，建议刷新名单使用最新口径</Text>
          </View>
          <View className={styles.refreshBtn} onClick={handleRefresh}>
            <Text>刷新</Text>
          </View>
        </View>
      )}

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>入选名单</Text>
        <Text className={styles.sectionSub}>快照共 {snapshotCustomers.length} 人，有效 {validCustomers.length} 人</Text>
      </View>

      <ScrollView scrollY className={styles.listScroll}>
        {validCustomers.length > 0 && (
          <View className={styles.listGroup}>
            {validCustomers.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} onClick={handleCustomerClick} />
            ))}
          </View>
        )}

        {excludedCustomers.length > 0 && (
          <View className={styles.listGroup}>
            <View className={styles.groupHeader}>
              <Text className={styles.groupTitle}>已排除（退订）</Text>
              <Text className={styles.groupCount}>{excludedCustomers.length} 人</Text>
            </View>
            {excludedCustomers.map((customer) => (
              <View key={customer.id} className={styles.excludedCard} onClick={() => handleCustomerClick(customer.id)}>
                <Image className={styles.excludedAvatar} src={customer.avatar} mode='aspectFill' />
                <View className={styles.excludedInfo}>
                  <Text className={styles.excludedName}>{customer.name}</Text>
                  <Text className={styles.excludedPhone}>{customer.phone}</Text>
                  <View className={styles.excludedTags}>
                    {customer.tags.map((tag) => (
                      <Text key={tag.id} className={styles.excludedTag} style={{ color: tag.color, borderColor: tag.color }}>
                        {tag.name}
                      </Text>
                    ))}
                  </View>
                </View>
                <View className={styles.excludedBadge}>
                  <Text>已退订</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {snapshotCustomers.length === 0 && (
          <EmptyState title='暂无名单' description='该计划还没有匹配到客户' />
        )}
      </ScrollView>

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
