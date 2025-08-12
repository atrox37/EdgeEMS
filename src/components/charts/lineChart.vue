<template>
  <div class="line-chart" ref="chartRef"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { TooltipComponent, GridComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([LineChart, TooltipComponent, GridComponent, LegendComponent, CanvasRenderer])

// ================== 示例数据（可用数据，供参考，实际使用时请传递props） ==================
// 下面是一些可用于该组件的示例数据，已注释，方便你参考和测试
/*
  const exampleXAxisData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  
  const exampleSeries = [
    {
      name: '光伏发电',
      data: [120, 132, 101, 134, 90, 230, 210],
      color: '#4FADF7'
    },
    {
      name: '柴油发电',
      data: [220, 182, 191, 234, 290, 330, 310],
      color: '#F6C85F'
    },
    {
      name: '储能放电',
      data: [150, 232, 201, 154, 190, 330, 410],
      color: '#6DD400'
    }
  ]
  
  // 传递给组件的props示例
  const xAxiosOption = {
    xAxiosData: exampleXAxisData,
    xUnit: '天'
  }
  const yAxiosOption = {
    yUnit: 'kWh'
  }
  const series = exampleSeries
  */

// 定义数据类型
interface SeriesData {
  name: string
  data: number[]
  color: string
}

interface XAxisOption {
  xAxiosData: string[]
  xUnit?: string
}

interface YAxisOption {
  yUnit?: string
}

const props = defineProps<{
  xAxiosOption: XAxisOption
  yAxiosOption: YAxisOption
  series: SeriesData[]
}>()

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// 初始化echarts
const initChart = () => {
  if (!chartRef.value) return
  if (chartInstance) {
    chartInstance.dispose()
  }
  chartInstance = echarts.init(chartRef.value)

  // 获取x轴和y轴单位
  const xUnit = props.xAxiosOption.xUnit || ''
  const yUnit = props.yAxiosOption.yUnit || ''

  // 计算总值用于背景柱
  const totalData = props.xAxiosOption.xAxiosData.map((_, index) => {
    return props.series.reduce((sum, s) => sum + (s.data[index] || 0), 0)
  })

  // 根据柱子数目自动计算bar宽度
  const chartWidth = chartRef.value.clientWidth || 600
  const dataCount = props.xAxiosOption.xAxiosData.length
  const availableWidth = chartWidth - 100 // 减去左右边距
  const barSpacing = Math.max(15, (availableWidth * 0.1) / dataCount) // 柱子间距
  const barWidth = Math.min(60, (availableWidth - barSpacing * (dataCount - 1)) / dataCount)

  const seriesData = [
    // 透明背景系列
    {
      name: 'background',
      type: 'bar',
      barWidth: barWidth,
      barGap: '-100%',
      itemStyle: {
        color: 'rgba(255,255,255,0)',
      },
      data: totalData,
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(252, 252, 253, 0.04)',
      },
      silent: true,
      emphasis: { disabled: true },
      tooltip: { show: false },
      label: { show: false },
      z: 0,
    },
    ...props.series.map((s) => ({
      name: s.name,
      type: 'line', // 改为线形图
      data: s.data,
      smooth: false, // 不使用平滑曲线，点与点之间直线连接
      symbol: 'circle', // 数据点样式
      symbolSize: 0, // 数据点大小
      lineStyle: {
        color: s.color,
        width: 4, // 线条宽度
      },
      itemStyle: {
        color: s.color,
        borderColor: s.color,
        borderWidth: 2,
      },
      emphasis: {
        focus: 'series',
        scale: true,
        scaleSize: 8,
      },
      z: 1, // 线条在背景之上
    })),
  ]

  chartInstance.setOption({
    legend: {
      show: true,
      type: 'plain',
      orient: 'horizontal',
      right: 0,
      top: 0,
      itemWidth: 12, // 色块宽度12px
      itemHeight: 12, // 色块高度12px
      itemGap: 25, // 间距25px
      textStyle: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
        fontFamily: 'Arimo',
        fontWeight: 400,
      },
      data: props.series.map((s) => s.name),
    },
    grid: {
      left: 0,
      right: 0,
      top: 45,
      bottom: 15,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      confine: true,
      textStyle: {
        fontFamily: 'Arimo',
        fontWeight: 400,
        fontSize: 12,
      },
    },
    xAxis: {
      type: 'category',
      name: xUnit,
      nameTextStyle: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontFamily: 'Arimo',
        fontWeight: 400,
        fontSize: 12,
        padding: [10, 0, 0, 0],
      },
      data: props.xAxiosOption.xAxiosData,
      axisTick: {
        alignWithLabel: true,
        lineStyle: { color: '#fff' },
      },
      axisLine: { show: false },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontFamily: 'Arimo',
        fontWeight: 400,
        fontSize: 12,
      },
      splitLine: { show: false }, // 清除x轴网格线
      // 控制柱体居中的关键配置
      boundaryGap: true,
    },
    yAxis: {
      type: 'value',
      name: yUnit,
      nameTextStyle: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontFamily: 'Arimo',
        fontWeight: 400,
        fontSize: 12,
        align: 'right', // 水平居中对齐
        padding: [0, 8, 5, 0], // 上右下左的内边距，向下偏移5px
      },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontFamily: 'Arimo',
        fontWeight: 400,
        fontSize: 12,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#fff',
          type: 'dashed', // y轴网格线设为虚线
          opacity: 0.2,
        },
      },
    },
    series: seriesData,
  })
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeChart)
})

const resizeChart = () => {
  chartInstance?.resize()
}

watch(
  () => [props.xAxiosOption.xAxiosData, props.series],
  () => {
    initChart()
  },
  { deep: true },
)

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  chartInstance?.dispose()
})
</script>

<style scoped lang="scss">
.line-chart {
  width: 100%;
  height: 100%;
}
</style>
