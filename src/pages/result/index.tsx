import React, { useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { mockCampaignResults, mockCustomerActions, mockTransactionFeedbacks } from '@/data/results'
import classnames from 'classnames'
import styles from './index.module.scss'

type ActionTab = 'all' | 'open' | 'click' | 'consult' | 'appoint' | 'unsubscribe'

const actionStyleMap: Record<string, string> = {
  open: styles.actionTagOpen,
  click: styles.actionTagClick,
  consult: styles.actionTagConsult,
  appoint: styles.actionTagAppoint,
  unsubscribe: styles.actionTagUnsubscribe
}

export default function ResultPage() {
  const [actionTab, setActionTab] = useState<ActionTab>('all')
  const latestResult = mockCampaignResults[0]

  const filteredActions = actionTab === 'all'
    ? mockCustomerActions
    : mockCustomerActions.filter((a) => a.actionType === actionTab)

  const handleMarkUnsubscribe = (customerId: string, customerName: string) => {
    Taro.showModal({
      title: '标记退订意向',
      content: `确认标记${customerName}为退订意向客户？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已标记', icon: 'success' })
          console.info('[Result] Marked unsubscribe:', customerId)
        }
      }
    })
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>效果回收</Text>
        <Text className={styles.headerDesc}>追踪触达效果，优化运营策略</Text>
      </View>

      {latestResult && (
        <View className={styles.funnelSection}>
          <Text className={styles.sectionTitle}>转化漏斗</Text>
          <View className={styles.funnelContainer}>
            <View className={styles.funnelItem}>
              <Text className={styles.funnelLabel}>发送</Text>
              <View className={styles.funnelBarWrap}>
                <View className={`${styles.funnelBar} ${styles.funnelBarOpen}`} style={{ width: '100%' }} />
              </View>
              <Text className={styles.funnelValue}>{latestResult.sentCount}</Text>
              <Text className={styles.funnelRate}>100%</Text>
            </View>
            <View className={styles.funnelItem}>
              <Text className={styles.funnelLabel}>打开</Text>
              <View className={styles.funnelBarWrap}>
                <View className={`${styles.funnelBar} ${styles.funnelBarOpen}`} style={{ width: `${latestResult.openRate}%` }} />
              </View>
              <Text className={styles.funnelValue}>{latestResult.openCount}</Text>
              <Text className={styles.funnelRate}>{latestResult.openRate}%</Text>
            </View>
            <View className={styles.funnelItem}>
              <Text className={styles.funnelLabel}>点击</Text>
              <View className={styles.funnelBarWrap}>
                <View className={`${styles.funnelBar} ${styles.funnelBarClick}`} style={{ width: `${latestResult.clickRate}%` }} />
              </View>
              <Text className={styles.funnelValue}>{latestResult.clickCount}</Text>
              <Text className={styles.funnelRate}>{latestResult.clickRate}%</Text>
            </View>
            <View className={styles.funnelItem}>
              <Text className={styles.funnelLabel}>咨询</Text>
              <View className={styles.funnelBarWrap}>
                <View className={`${styles.funnelBar} ${styles.funnelBarConsult}`} style={{ width: `${latestResult.consultRate}%` }} />
              </View>
              <Text className={styles.funnelValue}>{latestResult.consultCount}</Text>
              <Text className={styles.funnelRate}>{latestResult.consultRate}%</Text>
            </View>
            <View className={styles.funnelItem}>
              <Text className={styles.funnelLabel}>预约</Text>
              <View className={styles.funnelBarWrap}>
                <View className={`${styles.funnelBar} ${styles.funnelBarAppoint}`} style={{ width: `${Math.max(latestResult.appointRate * 2, 8)}%` }} />
              </View>
              <Text className={styles.funnelValue}>{latestResult.appointCount}</Text>
              <Text className={styles.funnelRate}>{latestResult.appointRate}%</Text>
            </View>
            <View className={styles.funnelItem}>
              <Text className={styles.funnelLabel}>退订</Text>
              <View className={styles.funnelBarWrap}>
                <View className={`${styles.funnelBar} ${styles.funnelBarUnsub}`} style={{ width: `${Math.max(latestResult.unsubscribeCount / latestResult.sentCount * 100 * 5, 5)}%` }} />
              </View>
              <Text className={styles.funnelValue}>{latestResult.unsubscribeCount}</Text>
              <Text className={styles.funnelRate}>{(latestResult.unsubscribeCount / latestResult.sentCount * 100).toFixed(1)}%</Text>
            </View>
          </View>
        </View>
      )}

      <View className={styles.resultCards}>
        <Text className={styles.sectionTitle}>群发效果</Text>
        {mockCampaignResults.map((result) => (
          <View key={result.id} className={styles.resultCard}>
            <View className={styles.resultCardHeader}>
              <Text className={styles.resultCardName}>{result.campaignName}</Text>
              <Text className={styles.resultCardTime}>{result.sentTime}</Text>
            </View>
            <View className={styles.resultStatsGrid}>
              <View className={styles.resultStatItem}>
                <Text className={styles.resultStatValue}>{result.sentCount}</Text>
                <Text className={styles.resultStatLabel}>发送</Text>
              </View>
              <View className={styles.resultStatItem}>
                <Text className={styles.resultStatValue}>{result.openCount}</Text>
                <Text className={styles.resultStatLabel}>打开</Text>
              </View>
              <View className={styles.resultStatItem}>
                <Text className={styles.resultStatValue}>{result.clickCount}</Text>
                <Text className={styles.resultStatLabel}>点击</Text>
              </View>
              <View className={styles.resultStatItem}>
                <Text className={styles.resultStatValue}>{result.consultCount}</Text>
                <Text className={styles.resultStatLabel}>咨询</Text>
              </View>
              <View className={styles.resultStatItem}>
                <Text className={styles.resultStatValue}>{result.appointCount}</Text>
                <Text className={styles.resultStatLabel}>预约</Text>
              </View>
            </View>
            <View className={styles.revenueTag}>
              <Text>成交 ¥{result.totalRevenue.toLocaleString()}</Text>
            </View>
          </View>
        ))}
      </View>

      <View className={styles.actionsSection}>
        <Text className={styles.sectionTitle}>客户行为追踪</Text>
        <View style={{ display: 'flex', gap: '12rpx', marginBottom: '16rpx', flexWrap: 'wrap' }}>
          {(['all', 'open', 'click', 'consult', 'appoint', 'unsubscribe'] as ActionTab[]).map((tab) => (
            <View
              key={tab}
              className={classnames(styles.tab, actionTab === tab && styles.tabActive)}
              onClick={() => setActionTab(tab)}
            >
              <Text style={{ fontSize: '24rpx', color: actionTab === tab ? '#fff' : '#8B85A8' }}>
                {tab === 'all' ? '全部' : tab === 'open' ? '打开' : tab === 'click' ? '点击' : tab === 'consult' ? '咨询' : tab === 'appoint' ? '预约' : '退订'}
              </Text>
            </View>
          ))}
        </View>
        <View className={styles.actionList}>
          {filteredActions.map((action) => (
            <View
              key={action.id}
              className={styles.actionItem}
              onClick={() => action.actionType === 'unsubscribe' && handleMarkUnsubscribe(action.customerId, action.customerName)}
            >
              <Image className={styles.actionAvatar} src={action.customerAvatar} mode='aspectFill' />
              <View className={styles.actionInfo}>
                <Text className={styles.actionName}>{action.customerName}</Text>
                <Text className={styles.actionDetail}>{action.detail}</Text>
              </View>
              <Text className={classnames(styles.actionTag, actionStyleMap[action.actionType])}>{action.actionTypeName}</Text>
              <Text className={styles.actionTime}>{action.actionTime.split(' ')[1]}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.feedbackSection}>
        <Text className={styles.sectionTitle}>成交反馈</Text>
        {mockTransactionFeedbacks.map((fb) => (
          <View key={fb.id} className={styles.feedbackCard}>
            <View className={styles.feedbackHeader}>
              <Text className={styles.feedbackName}>{fb.customerName}</Text>
              <Text className={classnames(styles.feedbackStatus, fb.status === 'confirmed' ? styles.feedbackStatusConfirmed : styles.feedbackStatusPending)}>
                {fb.status === 'confirmed' ? '已确认' : '待确认'}
              </Text>
            </View>
            <View className={styles.feedbackDetail}>
              <Text className={styles.feedbackProject}>{fb.project}</Text>
              <Text className={styles.feedbackAmount}>¥{fb.amount.toLocaleString()}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}
