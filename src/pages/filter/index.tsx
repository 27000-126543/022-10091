import React, { useState, useMemo, useCallback } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import TagFilter from '@/components/TagFilter'
import { mockLabelGroups, mockFilterPresets } from '@/data/labels'
import { mockCustomers } from '@/data/customers'
import { useFilterStore } from '@/store/useFilterStore'
import classnames from 'classnames'
import styles from './index.module.scss'

export default function FilterPage() {
  const { selectedFilters, excludeSensitive, toggleFilter, setExcludeSensitive, resetFilters } = useFilterStore()
  const [activePreset, setActivePreset] = useState<string | null>(null)
  const [labelGroups] = useState(mockLabelGroups)

  const resultCount = useMemo(() => {
    let filtered = mockCustomers
    const projectFilters = selectedFilters['project'] || []
    const stageFilters = selectedFilters['stage'] || []
    const priceFilters = selectedFilters['price'] || []
    const activityFilters = selectedFilters['activity'] || []

    if (projectFilters.length > 0) {
      filtered = filtered.filter((c) => c.consultProjects.some((p) => projectFilters.includes(p)))
    }
    if (stageFilters.length > 0) {
      filtered = filtered.filter((c) => stageFilters.includes(c.surgeryStage))
    }
    if (priceFilters.length > 0) {
      filtered = filtered.filter((c) => priceFilters.includes(c.priceSensitivity))
    }
    if (activityFilters.length > 0) {
      filtered = filtered.filter((c) => activityFilters.includes(c.activityLevel))
    }
    if (excludeSensitive) {
      filtered = filtered.filter((c) => !c.isSensitive)
    }
    return filtered.length
  }, [selectedFilters, excludeSensitive])

  const activeFilterNames = useMemo(() => {
    const names: string[] = []
    Object.values(selectedFilters).forEach((vals) => {
      vals.forEach((v) => names.push(v))
    })
    return names
  }, [selectedFilters])

  const handleToggle = useCallback(
    (groupId: string, optionName: string) => {
      toggleFilter(groupId, optionName)
      setActivePreset(null)
    },
    [toggleFilter]
  )

  const handlePresetClick = useCallback(
    (preset: typeof mockFilterPresets[0]) => {
      setActivePreset(preset.id)
      resetFilters()
      Object.entries(preset.filters).forEach(([groupId, options]) => {
        options.forEach((opt) => toggleFilter(groupId, opt))
      })
    },
    [resetFilters, toggleFilter]
  )

  const handleApply = () => {
    if (resultCount === 0) {
      Taro.showToast({ title: '筛选结果为空', icon: 'none' })
      return
    }
    Taro.showToast({ title: `已筛选${resultCount}人`, icon: 'success' })
    console.info('[Filter] Applied filters:', selectedFilters, 'result:', resultCount)
  }

  return (
    <View className={styles.page}>
      <View className={styles.presetSection}>
        <Text className={styles.sectionTitle}>快捷方案</Text>
        <ScrollView scrollX className={styles.presetScroll}>
          <View className={styles.presetList}>
            {mockFilterPresets.map((preset) => (
              <View
                key={preset.id}
                className={classnames(styles.presetCard, activePreset === preset.id && styles.presetCardActive)}
                onClick={() => handlePresetClick(preset)}
              >
                <Text className={styles.presetName}>{preset.name}</Text>
                <Text className={styles.presetDesc}>{preset.description}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {activeFilterNames.length > 0 && (
        <View className={styles.activeFilters}>
          <View className={styles.activeFilterHeader}>
            <Text className={styles.activeFilterTitle}>已选条件</Text>
            <View className={styles.clearBtn} onClick={resetFilters}>
              <Text>清除全部</Text>
            </View>
          </View>
          <View className={styles.activeFilterTags}>
            {activeFilterNames.map((name) => (
              <Text key={name} className={styles.activeFilterTag}>{name}</Text>
            ))}
          </View>
        </View>
      )}

      <View className={styles.filterSection}>
        <Text className={styles.sectionTitle}>多维标签筛选</Text>
        {labelGroups.map((group) => (
          <TagFilter key={group.id} group={group} onToggle={handleToggle} />
        ))}
      </View>

      <View className={styles.excludeSection}>
        <View className={styles.excludeRow}>
          <View>
            <Text className={styles.excludeLabel}>排除敏感客群</Text>
            <Text className={styles.excludeDesc}>过滤投诉风险、孕期等敏感客户</Text>
          </View>
          <View
            className={classnames(styles.toggle, excludeSensitive && styles.toggleActive)}
            onClick={() => setExcludeSensitive(!excludeSensitive)}
          >
            <View className={styles.toggleDot} />
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.resultInfo}>
          <Text className={styles.resultCount}>{resultCount}</Text>
          <Text className={styles.resultLabel}> 人匹配</Text>
        </View>
        <View className={styles.resetBtn} onClick={resetFilters}>
          <Text>重置</Text>
        </View>
        <View className={styles.submitBtn} onClick={handleApply}>
          <Text>确认筛选</Text>
        </View>
      </View>
    </View>
  )
}
