import React from 'react'
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'

interface Props {
  title?: string
  description?: string
}

export default function EmptyState({ title = '暂无数据', description = '' }: Props) {
  return (
    <View className={styles.container}>
      <View className={styles.icon}>
        <Text className={styles.iconText}>📭</Text>
      </View>
      <Text className={styles.title}>{title}</Text>
      {description && <Text className={styles.description}>{description}</Text>}
    </View>
  )
}
