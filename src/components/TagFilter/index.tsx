import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import type { LabelGroup } from '@/types/label'
import styles from './index.module.scss'

interface Props {
  group: LabelGroup
  onToggle: (groupId: string, optionName: string) => void
}

const typeStyles: Record<string, string> = {
  project: styles.optionProject,
  stage: styles.optionStage,
  price: styles.optionPrice,
  activity: styles.optionActivity,
  custom: styles.optionCustom
}

export default function TagFilter({ group, onToggle }: Props) {
  return (
    <View className={styles.group}>
      <View className={styles.groupHeader}>
        <Text className={styles.groupName}>{group.name}</Text>
        <Text className={styles.groupType}>
          {group.type === 'project' ? '咨询项目' : group.type === 'stage' ? '术后阶段' : group.type === 'price' ? '价格敏感度' : group.type === 'activity' ? '活跃互动' : '自定义'}
        </Text>
      </View>
      <View className={styles.options}>
        {group.options.map((option) => (
          <View
            key={option.id}
            className={classnames(styles.option, option.selected && styles.optionSelected, typeStyles[group.type])}
            onClick={() => onToggle(group.id, option.name)}
          >
            <Text className={classnames(styles.optionText, option.selected && styles.optionTextSelected)}>{option.name}</Text>
            <Text className={classnames(styles.optionCount, option.selected && styles.optionCountSelected)}>{option.count}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}
