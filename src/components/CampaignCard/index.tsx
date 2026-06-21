import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import type { Campaign } from '@/types/campaign'
import styles from './index.module.scss'

interface Props {
  campaign: Campaign
  onClick?: (id: string) => void
}

const statusStyles: Record<string, string> = {
  draft: styles.statusDraft,
  scheduled: styles.statusScheduled,
  sending: styles.statusSending,
  sent: styles.statusSent,
  failed: styles.statusFailed
}

export default function CampaignCard({ campaign, onClick }: Props) {
  return (
    <View className={styles.card} onClick={() => onClick?.(campaign.id)}>
      <View className={styles.header}>
        <Text className={styles.name}>{campaign.name}</Text>
        <Text className={classnames(styles.status, statusStyles[campaign.status])}>{campaign.statusName}</Text>
      </View>
      <View className={styles.filterRow}>
        <Text className={styles.filterLabel}>筛选条件</Text>
        <Text className={styles.filterValue}>{campaign.filterSummary}</Text>
      </View>
      <View className={styles.contentRow}>
        <Text className={styles.contentLabel}>推送内容</Text>
        <Text className={styles.contentValue}>{campaign.contentTitle}</Text>
      </View>
      <View className={styles.footer}>
        <Text className={styles.audience}>{campaign.audienceCount}人</Text>
        <Text className={styles.time}>{campaign.scheduledTime || '未设定时间'}</Text>
        {campaign.excludeSensitive && <Text className={styles.excludeTag}>已排除敏感客群</Text>}
      </View>
    </View>
  )
}
