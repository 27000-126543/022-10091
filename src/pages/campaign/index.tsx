import React, { useState } from 'react'
import { View, Text, Input, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import CampaignCard from '@/components/CampaignCard'
import EmptyState from '@/components/EmptyState'
import { mockCampaigns } from '@/data/campaigns'
import styles from './index.module.scss'

export default function CampaignPage() {
  const [campaigns] = useState(mockCampaigns)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [excludeSensitive, setExcludeSensitive] = useState(true)

  const draftCount = campaigns.filter((c) => c.status === 'draft').length
  const scheduledCount = campaigns.filter((c) => c.status === 'scheduled').length
  const sentCount = campaigns.filter((c) => c.status === 'sent').length
  const failedCount = campaigns.filter((c) => c.status === 'failed').length

  const handleCampaignClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/campaign-detail/index?id=${id}` })
  }

  const handleCreate = () => {
    if (!newName.trim()) {
      Taro.showToast({ title: '请输入计划名称', icon: 'none' })
      return
    }
    Taro.showToast({ title: '群发计划已创建', icon: 'success' })
    console.info('[Campaign] Created:', newName, 'excludeSensitive:', excludeSensitive)
    setShowCreate(false)
    setNewName('')
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
        <View className={styles.createBtn} onClick={() => setShowCreate(true)}>
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
              <Text className={styles.formLabel}>排除敏感客群</Text>
              <View className={styles.formToggleRow}>
                <Text className={styles.formToggleLabel}>
                  {excludeSensitive ? '已开启' : '已关闭'}
                </Text>
                <View
                  className={`${styles.toggle} ${excludeSensitive ? styles.toggleActive : ''}`}
                  onClick={() => setExcludeSensitive(!excludeSensitive)}
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
