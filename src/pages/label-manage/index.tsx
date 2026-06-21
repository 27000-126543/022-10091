import React from 'react'
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'

export default function LabelManagePage() {
  return (
    <View className={styles.container}>
      <Text className={styles.title}>标签管理</Text>
      <Text className={styles.desc}>功能正在开发中...</Text>
    </View>
  )
}
