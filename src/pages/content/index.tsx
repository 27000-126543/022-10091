import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import ContentCard from '@/components/ContentCard'
import { mockContents, mockCoupons } from '@/data/contents'
import { useAppStore } from '@/store/useAppStore'
import type { ContentType } from '@/types/content'
import styles from './index.module.scss'

const contentTabs: { key: ContentType | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'case', label: '案例种草' },
  { key: 'science', label: '医生科普' },
  { key: 'coupon', label: '限时权益' }
]

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState<ContentType | 'all'>('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const setSelectedContent = useAppStore((s) => s.setSelectedContent)

  const filteredContents = useMemo(() => {
    if (activeTab === 'all') return mockContents
    return mockContents.filter((c) => c.type === activeTab)
  }, [activeTab])

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleMatch = () => {
    if (selectedIds.length === 0) {
      Taro.showToast({ title: '请先选择内容', icon: 'none' })
      return
    }
    const selectedItems = mockContents.filter((c) => selectedIds.includes(c.id))
    const couponIds = selectedItems
      .filter((c) => c.couponId)
      .map((c) => c.couponId as string)

    setSelectedContent({ items: selectedItems, couponIds })
    console.info('[Content] Matched content:', selectedIds, 'coupons:', couponIds)

    Taro.showToast({ title: `已匹配${selectedIds.length}个内容`, icon: 'success' })
    setTimeout(() => {
      Taro.switchTab({ url: '/pages/campaign/index' })
    }, 1500)
  }

  return (
    <View className={styles.page}>
      <View className={styles.tabs}>
        {contentTabs.map((tab) => (
          <View
            key={tab.key}
            className={classnames(styles.tab, activeTab === tab.key && styles.tabActive)}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text>{tab.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.couponSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>活动券</Text>
        </View>
        <ScrollView scrollX className={styles.couponScroll}>
          <View className={styles.couponList}>
            {mockCoupons.map((coupon) => (
              <View key={coupon.id} className={styles.couponCard}>
                <Text className={styles.couponDiscount}>{coupon.discount}</Text>
                <Text className={styles.couponName}>{coupon.name}</Text>
                <Text className={styles.couponValid}>有效期至{coupon.validUntil}</Text>
                <Text className={styles.couponUsage}>已领{coupon.usedCount}/{coupon.totalCount}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView scrollY className={styles.contentList} style={{ height: 'calc(100vh - 600rpx)' }}>
        {filteredContents.map((item) => (
          <ContentCard
            key={item.id}
            item={{ ...item, selected: selectedIds.includes(item.id) }}
            onSelect={handleSelect}
          />
        ))}
      </ScrollView>

      <View className={styles.selectedBar}>
        <View className={styles.selectedInfo}>
          <Text className={styles.selectedCount}>{selectedIds.length}</Text>
          <Text className={styles.selectedLabel}>个内容已选</Text>
        </View>
        <View className={styles.matchBtn} onClick={handleMatch}>
          <Text>匹配发送</Text>
        </View>
      </View>
    </View>
  )
}
