import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import classnames from 'classnames'
import type { Customer } from '@/types/customer'
import styles from './index.module.scss'

interface Props {
  customer: Customer
  onClick?: (id: string) => void
}

const activityLabel: Record<string, string> = {
  '高互动': styles.tagActivityHigh,
  '中互动': styles.tagActivityMid,
  '低互动': styles.tagActivityLow,
  '沉默': styles.tagActivitySilent
}

export default function CustomerCard({ customer, onClick }: Props) {
  return (
    <View className={styles.card} onClick={() => onClick?.(customer.id)}>
      <View className={styles.header}>
        <Image className={styles.avatar} src={customer.avatar} mode='aspectFill' />
        <View className={styles.info}>
          <View className={styles.nameRow}>
            <Text className={styles.name}>{customer.name}</Text>
            {customer.unsubscribed && <Text className={styles.unsubTag}>已退订</Text>}
            {customer.isSensitive && <Text className={styles.sensitiveTag}>敏感</Text>}
          </View>
          <Text className={styles.note}>{customer.wechatNote}</Text>
        </View>
        <Text className={styles.lastActive}>{customer.lastActiveTime}</Text>
      </View>
      <View className={styles.tags}>
        {customer.tags.map((tag) => (
          <Text
            key={tag.id}
            className={classnames(styles.tag, tag.type === 'project' && styles.tagProject, tag.type === 'stage' && styles.tagStage, tag.type === 'price' && styles.tagPrice, tag.type === 'activity' && activityLabel[tag.name])}
          >
            {tag.name}
          </Text>
        ))}
      </View>
      <View className={styles.footer}>
        <Text className={styles.stat}>咨询{customer.totalConsultations}次</Text>
        {customer.totalSpent > 0 && <Text className={styles.spent}>已消费¥{customer.totalSpent.toLocaleString()}</Text>}
      </View>
    </View>
  )
}
