import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import classnames from 'classnames'
import type { ContentItem } from '@/types/content'
import styles from './index.module.scss'

interface Props {
  item: ContentItem
  onSelect?: (id: string) => void
}

const typeStyle: Record<string, string> = {
  case: styles.typeCase,
  science: styles.typeScience,
  coupon: styles.typeCoupon
}

export default function ContentCard({ item, onSelect }: Props) {
  return (
    <View className={styles.card} onClick={() => onSelect?.(item.id)}>
      <Image className={styles.cover} src={item.coverImage} mode='aspectFill' />
      <View className={styles.body}>
        <View className={styles.typeRow}>
          <Text className={classnames(styles.typeTag, typeStyle[item.type])}>{item.typeName}</Text>
          {item.couponName && <Text className={styles.couponTag}>{item.couponDiscount}</Text>}
        </View>
        <Text className={styles.title}>{item.title}</Text>
        <Text className={styles.desc}>{item.description}</Text>
        <View className={styles.stats}>
          <Text className={styles.statItem}>{item.viewCount}浏览</Text>
          <Text className={styles.statItem}>{item.likeCount}赞</Text>
          <Text className={styles.statItem}>{item.shareCount}分享</Text>
        </View>
      </View>
      {item.selected && <View className={styles.selectedBadge}>已选</View>}
    </View>
  )
}
