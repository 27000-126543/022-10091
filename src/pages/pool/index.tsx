import React, { useState, useMemo } from 'react'
import { View, Text, Input, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import CustomerCard from '@/components/CustomerCard'
import EmptyState from '@/components/EmptyState'
import { mockCustomers } from '@/data/customers'
import styles from './index.module.scss'

type TabKey = 'all' | 'consulted' | 'postSurgery' | 'inactive'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'consulted', label: '已咨询' },
  { key: 'postSurgery', label: '术后' },
  { key: 'inactive', label: '沉默' }
]

export default function PoolPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('all')
  const [searchText, setSearchText] = useState('')

  const filteredCustomers = useMemo(() => {
    let result = mockCustomers
    if (searchText) {
      result = result.filter(
        (c) =>
          c.name.includes(searchText) ||
          c.wechatNote.includes(searchText) ||
          c.phone.includes(searchText)
      )
    }
    switch (activeTab) {
      case 'consulted':
        return result.filter((c) => c.totalConsultations > 0)
      case 'postSurgery':
        return result.filter((c) => c.surgeryStage !== '术前')
      case 'inactive':
        return result.filter((c) => c.activityLevel === '沉默' || c.activityLevel === '低互动')
      default:
        return result
    }
  }, [activeTab, searchText])

  const totalCustomers = mockCustomers.length
  const newThisWeek = 4
  const activeRate = Math.round(
    (mockCustomers.filter((c) => c.activityLevel === '高互动' || c.activityLevel === '中互动').length / totalCustomers) * 100
  )

  const handleImportWechat = () => {
    Taro.showModal({
      title: '导入企微备注',
      content: '确认从企业微信导入客户备注信息？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '导入成功', icon: 'success' })
          console.info('[Pool] WeChat notes imported')
        }
      }
    })
  }

  const handleCustomerClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/customer-detail/index?id=${id}` })
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder='搜索客户姓名/备注/手机号'
            placeholderClass={styles.searchInput}
            value={searchText}
            onInput={(e) => setSearchText(e.detail.value)}
          />
          <View className={styles.importBtn} onClick={handleImportWechat}>
            导入企微
          </View>
        </View>
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{totalCustomers}</Text>
            <Text className={styles.statLabel}>总客户</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{newThisWeek}</Text>
            <Text className={styles.statLabel}>本周新增</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{activeRate}%</Text>
            <Text className={styles.statLabel}>活跃率</Text>
          </View>
        </View>
      </View>

      <View className={styles.tabs}>
        {tabs.map((tab) => (
          <View
            key={tab.key}
            className={classnames(styles.tab, activeTab === tab.key && styles.tabActive)}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text>{tab.label}</Text>
          </View>
        ))}
      </View>

      <ScrollView scrollY className={styles.list} style={{ height: 'calc(100vh - 460rpx)' }}>
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} onClick={handleCustomerClick} />
          ))
        ) : (
          <EmptyState title='暂无匹配客户' description='试试调整筛选条件' />
        )}
      </ScrollView>
    </View>
  )
}
