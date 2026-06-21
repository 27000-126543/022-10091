import React, { useState } from 'react'
import { View, Text, Input, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import CampaignCard from '@/components/CampaignCard'
import EmptyState from '@/components/EmptyState'
import { useAppStore } from '@/store/useAppStore'
import { mockCoupons } from '@/data/contents'
import dayjs from 'dayjs'
import styles from './index.module.scss'

export default function CampaignPage() {
  const campaigns = useAppStore((s) => s.campaigns)
  const addCampaign = useAppStore((s) => s.addCampaign)
  const selectedContent = useAppStore((s) => s.selectedContent)
  const getFilteredCustomers = useAppStore((s) => s.getFilteredCustomers)
  const getFilterSummary = useAppStore((s) => s.getFilterSummary)
  const excludeSensitive = useAppStore((s) => s.excludeSensitive)
  const clearSelectedContent = useAppStore((s) => s.clearSelectedContent)

  const setExcludeSensitive = useAppStore((s) => s.setExcludeSensitive)

  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newExcludeSensitive, setNewExcludeSensitive] = useState(excludeSensitive)

  const draftCount = campaigns.filter((c) => c.status === 'draft').length
  const scheduledCount = campaigns.filter((c) => c.status === 'scheduled').length
  const sentCount = campaigns.filter((c) => c.status === 'sent').length
  const failedCount = campaigns.filter((c) => c.status === 'failed').length

  const liveAudienceCount = getFilteredCustomers(newExcludeSensitive).length
  const liveFilterSummary = getFilterSummary(newExcludeSensitive)
  const hasContent = selectedContent.items.length > 0
  const contentTitle = selectedContent.items.length > 0
    ? selectedContent.items[0].title
    : ''
  const contentType = selectedContent.items.length > 0
    ? selectedContent.items[0].typeName
    : ''
  const contentSummary = selectedContent.items.length > 0
    ? `${selectedContent.items.map((i) => i.typeName).join(' + ')}共${selectedContent.items.length}个`
    : ''
  const couponNames = selectedContent.couponIds.length > 0
    ? mockCoupons.filter((c) => selectedContent.couponIds.includes(c.id)).map((c) => c.name)
    : []

  const openCreate = () => {
    setNewExcludeSensitive(excludeSensitive)
    setShowCreate(true)
  }

  const handleCampaignClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/campaign-detail/index?id=${id}` })
  }

  const handleCreate = () => {
    if (!newName.trim()) {
      Taro.showToast({ title: '请输入计划名称', icon: 'none' })
      return
    }

    const finalAudience = getFilteredCustomers(newExcludeSensitive)
    const finalAudienceCount = finalAudience.length
    const finalFilterSummary = getFilterSummary(newExcludeSensitive)
    const finalCustomerIds = finalAudience.map((c) => c.id)

    setExcludeSensitive(newExcludeSensitive)

    const newCampaign = {
      id: `cm_${Date.now()}`,
      name: newName.trim(),
      status: 'draft' as const,
      statusName: '草稿',
      audienceCount: finalAudienceCount,
      contentTitle: contentSummary || contentTitle,
      contentType: contentType,
      scheduledTime: '',
      sentTime: null,
      excludeSensitive: newExcludeSensitive,
      filterSummary: finalFilterSummary || '未设置筛选条件',
      customerIds: finalCustomerIds,
      createdAt: dayjs().format('YYYY-MM-DD')
    }

    addCampaign(newCampaign)
    clearSelectedContent()
    setShowCreate(false)
    setNewName('')

    Taro.showToast({ title: '群发计划已创建', icon: 'success' })
    console.info('[Campaign] Created:', newCampaign)
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>群发计划</Text>
        <Text className={styles.headerDesc}>管理群发任务，精准触达求美者</Text>
      </View>

      <View className={styles.statsGrid}>
        <View className={styles.statCard}>
          <Text className={`${styles.statValue} ${styles.statValueDraft}`}>{draftCount}</Text>
          <Text className={styles.statLabel}>草稿</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={`${styles.statValue} ${styles.statValueScheduled}`}>{scheduledCount}</Text>
          <Text className={styles.statLabel}>待发送</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={`${styles.statValue} ${styles.statValueSent}`}>{sentCount}</Text>
          <Text className={styles.statLabel}>已发送</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={`${styles.statValue} ${styles.statValueFailed}`}>{failedCount}</Text>
          <Text className={styles.statLabel}>失败</Text>
        </View>
      </View>

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>计划列表</Text>
        <View className={styles.createBtn} onClick={openCreate}>
          <Text>+ 新建</Text>
        </View>
      </View>

      <ScrollView scrollY style={{ height: 'calc(100vh - 520rpx)' }}>
        <View className={styles.campaignList}>
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} onClick={handleCampaignClick} />
            ))
          ) : (
            <EmptyState title='暂无群发计划' description='创建第一个群发计划开始运营' />
          )}
        </View>
      </ScrollView>

      {showCreate && (
        <View className={styles.newCampaignModal} onClick={() => setShowCreate(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.modalTitle}>新建群发计划</Text>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>计划名称</Text>
              <Input
                className={styles.formInput}
                placeholder='例如：七夕光电种草群发'
                value={newName}
                onInput={(e) => setNewName(e.detail.value)}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>筛选条件</Text>
              <View className={styles.formReadonly}>
                <Text className={styles.formReadonlyText}>{liveFilterSummary}</Text>
                <Text className={styles.formReadonlySub}>匹配{liveAudienceCount}人</Text>
              </View>
            </View>

            {hasContent && (
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>已选素材</Text>
                <View className={styles.formReadonly}>
                  <Text className={styles.formReadonlyText}>{contentSummary}</Text>
                  {selectedContent.items.map((item) => (
                    <Text key={item.id} className={styles.contentSubItem}>{item.typeName}：{item.title}</Text>
                  ))}
                </View>
              </View>
            )}

            {couponNames.length > 0 && (
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>活动券</Text>
                <View className={styles.formReadonly}>
                  {couponNames.map((name) => (
                    <Text key={name} className={styles.contentSubItem}>券：{name}</Text>
                  ))}
                </View>
              </View>
            )}

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>排除敏感客群</Text>
              <View className={styles.formToggleRow}>
                <Text className={styles.formToggleLabel}>
                  {newExcludeSensitive ? '已开启' : '已关闭'}
                </Text>
                <View
                  className={`${styles.toggle} ${newExcludeSensitive ? styles.toggleActive : ''}`}
                  onClick={() => setNewExcludeSensitive(!newExcludeSensitive)}
                >
                  <View className={styles.toggleDot} />
                </View>
              </View>
            </View>
            <View className={styles.modalActions}>
              <View className={styles.modalCancelBtn} onClick={() => setShowCreate(false)}>
                <Text>取消</Text>
              </View>
              <View className={styles.modalConfirmBtn} onClick={handleCreate}>
                <Text>创建</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
