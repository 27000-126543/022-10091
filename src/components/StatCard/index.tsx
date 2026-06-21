import React from 'react'
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'

interface Props {
  label: string
  value: string | number
  sub?: string
  trend?: 'up' | 'down' | 'flat'
  color?: string
}

export default function StatCard({ label, value, sub, trend, color }: Props) {
  return (
    <View className={styles.card}>
      <Text className={styles.label}>{label}</Text>
      <Text className={styles.value} style={color ? { color } : {}}>{value}</Text>
      {sub && <Text className={styles.sub}>{sub}</Text>}
      {trend && (
        <Text className={classnames(styles.trend, trend === 'up' && styles.trendUp, trend === 'down' && styles.trendDown)}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
        </Text>
      )}
    </View>
  )
}

function classnames(...args: (string | false | undefined)[]): string {
  return args.filter(Boolean).join(' ')
}
