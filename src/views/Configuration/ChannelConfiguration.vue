<template>
  <div class="voltage-class channel-configuration">
    <!-- Header -->
    <div class="header">
      <div class="header-left">
        <h2 class="title">通信信息列表说明</h2>
        <div class="stats">
          <span class="channel-count">当前通道数：{{ channels.length }}</span>
        </div>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="addChannel">
          <el-icon><Plus /></el-icon>
          添加通道
        </el-button>
      </div>
    </div>

    <!-- Content -->
    <div class="content">
      <el-collapse v-model="activeNames" accordion expand-icon-position="left">
        <el-collapse-item
          v-for="(channel, index) in channels"
          :key="channel.id"
          :name="channel.id"
          class="channel-collapse-item"
        >
          <template #title>
            <div class="channel-header">
              <div class="channel-header-left">
                <span class="channel-title">{{ channel.name }}</span>
                <el-tag type="primary">{{ channel.protocol }}</el-tag>
                <el-tag :type="channel.is_active ? 'success' : 'danger'">{{
                  channel.is_active ? 'enabled' : 'disabled'
                }}</el-tag>
              </div>
              <div class="channel-header-right">
                <div class="channel-header-right-item">遥测：{{ channel.telemetry.length }}</div>
                <div class="channel-header-right-item">遥信：{{ channel.telesignal.length }}</div>
                <div class="channel-header-right-item">遥控：{{ channel.telecontrol.length }}</div>
                <div class="channel-header-right-item">遥调：{{ channel.teleadjust.length }}</div>
                <el-button
                  type="primary"
                  @click="addPoint(channel, channel.activeTab)"
                  class="channel-header-right-btn"
                >
                  <el-icon><Plus /></el-icon>
                  添加点位
                </el-button>
              </div>
            </div>
          </template>

          <!-- 展开内容 -->
          <div class="channel-content">
            <el-tabs v-model="channel.activeTab" type="card">
              <el-tab-pane label="遥测" name="telemetry">
                <PointTable
                  :points="channel.telemetry"
                  title="遥测点位信息"
                  :channelId="channel.id"
                  @add-point="addPoint(channel, 'telemetry')"
                  @delete-point="deletePoint(channel, 'telemetry', $event)"
                  @update-point="updatePoint(channel, 'telemetry', $event)"
                />
              </el-tab-pane>
              <el-tab-pane label="遥信" name="telesignal">
                <PointTable
                  :points="channel.telesignal"
                  title="遥信点位信息"
                  :channelId="channel.id"
                  @add-point="addPoint(channel, 'telesignal')"
                  @delete-point="deletePoint(channel, 'telesignal', $event)"
                  @update-point="updatePoint(channel, 'telesignal', $event)"
                />
              </el-tab-pane>
              <el-tab-pane label="遥控" name="telecontrol">
                <PointTable
                  :points="channel.telecontrol"
                  title="遥控点位信息"
                  :channelId="channel.id"
                  @add-point="addPoint(channel, 'telecontrol')"
                  @delete-point="deletePoint(channel, 'telecontrol', $event)"
                  @update-point="updatePoint(channel, 'telecontrol', $event)"
                />
              </el-tab-pane>
              <el-tab-pane label="遥调" name="teleadjust">
                <PointTable
                  :points="channel.teleadjust"
                  title="遥调点位信息"
                  :channelId="channel.id"
                  @add-point="addPoint(channel, 'teleadjust')"
                  @delete-point="deletePoint(channel, 'teleadjust', $event)"
                  @update-point="updatePoint(channel, 'teleadjust', $event)"
                />
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, ArrowDown, ArrowRight } from '@element-plus/icons-vue'
import type { Channel, Point } from '@/types/channel'
import PointTable from './components/PointTable.vue'
// 生成唯一ID
let pointIdCounter = 20
const generatePointId = () => pointIdCounter++

// 创建新的点位
const createNewPoint = (
  type: 'telemetry' | 'telesignal' | 'telecontrol' | 'teleadjust' = 'telemetry',
): Point => {
  if (type === 'telemetry') {
    return {
      id: generatePointId(),
      signalName: '',
      scaleFactor: 1.0,
      offset: 0.0,
      unit: '',
      value: 0,
      reverse: false,
      dataType: 'FLOAT32',
      protocolConfig: {},
      enabled: true,
    }
  } else {
    // telesignal, telecontrol, teleadjust 不包含 scaleFactor, offset, reverse
    return {
      id: generatePointId(),
      signalName: '',
      unit: '',
      value: 0,
      dataType: type === 'telesignal' || type === 'telecontrol' ? 'BOOLEAN' : 'FLOAT32',
      protocolConfig: {},
      enabled: true,
    } as Point
  }
}

// 当前激活的折叠面板
const activeNames = ref<number[]>([1])

// 通道数据
const channels = ref<Channel[]>([
  {
    id: 1,
    name: 'Modbus TCP 通道1',
    activeTab: 'telemetry',
    protocol: 'Modbus TCP',
    is_active: true,
    telemetry: [
      {
        id: 1,
        signalName: '电压A相',
        scaleFactor: 0.1,
        offset: 0.0,
        value: 0,
        unit: 'V',
        reverse: false,
        dataType: 'FLOAT32',
        protocolConfig: {
          registerAddress: '40001',
          registerType: 'holding',
          byteOrder: 'big',
          readInterval: 5,
        },
        enabled: true,
      },
      {
        id: 2,
        signalName: '电压B相',
        scaleFactor: 0.1,
        offset: 0.0,
        value: 0,
        unit: 'V',
        reverse: false,
        dataType: 'FLOAT32',
        protocolConfig: {
          registerAddress: '40002',
          registerType: 'holding',
          byteOrder: 'big',
          readInterval: 5,
        },
        enabled: true,
      },
      {
        id: 3,
        signalName: '电压C相',
        scaleFactor: 0.1,
        offset: 0.0,
        value: 0,
        unit: 'V',
        reverse: false,
        dataType: 'FLOAT32',
        protocolConfig: {
          registerAddress: '40003',
          registerType: 'holding',
          byteOrder: 'big',
          readInterval: 5,
        },
        enabled: true,
      },
    ],
    telesignal: [
      {
        id: 4,
        signalName: '断路器状态',
        value: 0,
        unit: '',
        dataType: 'BOOLEAN',
        protocolConfig: {
          registerAddress: '00001',
          registerType: 'coil',
          byteOrder: 'big',
          readInterval: 2,
        },
        enabled: true,
      },
      {
        id: 5,
        signalName: '保护动作',
        value: 0,
        unit: '',
        dataType: 'BOOLEAN',
        protocolConfig: {
          registerAddress: '00002',
          registerType: 'coil',
          byteOrder: 'big',
          readInterval: 2,
        },
        enabled: true,
      },
    ],
    telecontrol: [
      {
        id: 6,
        signalName: '断路器合闸',
        value: 0,
        unit: '',
        dataType: 'BOOLEAN',
        protocolConfig: {
          registerAddress: '00001',
          registerType: 'coil',
          byteOrder: 'big',
          readInterval: 1,
        },
        enabled: true,
      },
    ],
    teleadjust: [
      {
        id: 7,
        signalName: '电压设定值',

        value: 0,
        unit: 'V',
        dataType: 'FLOAT32',
        protocolConfig: {
          registerAddress: '40010',
          registerType: 'holding',
          byteOrder: 'big',
          readInterval: 10,
        },
        enabled: true,
      },
    ],
  },
  {
    id: 2,
    name: 'Modbus RTU 通道2',
    activeTab: 'telemetry',
    protocol: 'Modbus RTU',
    is_active: true,
    telemetry: [
      {
        id: 8,
        signalName: '电流A相',
        scaleFactor: 0.01,
        offset: 0.0,
        value: 0,
        unit: 'A',
        reverse: false,
        dataType: 'FLOAT32',
        protocolConfig: {
          registerAddress: '30001',
          registerType: 'input',
          byteOrder: 'little',
          readInterval: 3,
        },
        enabled: true,
      },
      {
        id: 9,
        signalName: '电流B相',
        scaleFactor: 0.01,
        offset: 0.0,
        value: 0,
        unit: 'A',
        reverse: false,
        dataType: 'FLOAT32',
        protocolConfig: {
          registerAddress: '30002',
          registerType: 'input',
          byteOrder: 'little',
          readInterval: 3,
        },
        enabled: true,
      },
      {
        id: 10,
        signalName: '电流C相',
        scaleFactor: 0.01,
        offset: 0.0,
        value: 0,
        unit: 'A',
        reverse: false,
        dataType: 'FLOAT32',
        protocolConfig: {
          registerAddress: '30003',
          registerType: 'input',
          byteOrder: 'little',
          readInterval: 3,
        },
        enabled: true,
      },
      {
        id: 11,
        signalName: '有功功率',
        scaleFactor: 0.1,
        offset: 0.0,
        value: 0,
        unit: 'kW',
        reverse: false,
        dataType: 'FLOAT32',
        protocolConfig: {
          registerAddress: '30010',
          registerType: 'input',
          byteOrder: 'little',
          readInterval: 5,
        },
        enabled: true,
      },
    ],
    telesignal: [
      {
        id: 12,
        signalName: '设备在线状态',
        value: 0,
        unit: '',
        dataType: 'BOOLEAN',
        protocolConfig: {
          registerAddress: '10001',
          registerType: 'discrete',
          byteOrder: 'big',
          readInterval: 1,
        },
        enabled: true,
      },
    ],
    telecontrol: [
      {
        id: 13,
        signalName: '设备重启',
        value: 0,
        unit: '',
        dataType: 'BOOLEAN',
        protocolConfig: {
          registerAddress: '00010',
          registerType: 'coil',
          byteOrder: 'big',
          readInterval: 1,
        },
        enabled: false,
      },
    ],
    teleadjust: [
      {
        id: 14,
        signalName: '电流阈值设定',
        scaleFactor: 0.01,
        offset: 0.0,
        value: 0,
        unit: 'A',
        reverse: false,
        dataType: 'FLOAT32',
        protocolConfig: {
          registerAddress: '40020',
          registerType: 'holding',
          byteOrder: 'little',
          readInterval: 15,
        },
        enabled: true,
      },
    ],
  },
  {
    id: 3,
    name: 'IEC61850 通道3',
    activeTab: 'telemetry',
    protocol: 'IEC61850',
    is_active: true,
    telemetry: [
      {
        id: 15,
        signalName: '频率',
        scaleFactor: 0.01,
        offset: 0.0,
        value: 0,
        unit: 'Hz',
        reverse: false,
        dataType: 'FLOAT32',
        protocolConfig: {
          registerAddress: 'MMXU1.Hz.mag.f',
          registerType: 'holding',
          byteOrder: 'big',
          readInterval: 2,
        },
        enabled: true,
      },
      {
        id: 16,
        signalName: '功率因数',
        scaleFactor: 0.001,
        offset: 0.0,
        value: 0,
        unit: '',
        reverse: false,
        dataType: 'FLOAT32',
        protocolConfig: {
          registerAddress: 'MMXU1.PF.mag.f',
          registerType: 'holding',
          byteOrder: 'big',
          readInterval: 5,
        },
        enabled: true,
      },
    ],
    telesignal: [
      {
        id: 17,
        signalName: '保护跳闸',
        value: 0,
        unit: '',
        dataType: 'BOOLEAN',
        protocolConfig: {
          registerAddress: 'CSWI1.Pos.stVal',
          registerType: 'coil',
          byteOrder: 'big',
          readInterval: 1,
        },
        enabled: true,
      },
    ],
    telecontrol: [
      {
        id: 18,
        signalName: '开关控制',
        value: 0,
        unit: '',
        dataType: 'BOOLEAN',
        protocolConfig: {
          registerAddress: 'CSWI1.Pos.ctlVal',
          registerType: 'coil',
          byteOrder: 'big',
          readInterval: 1,
        },
        enabled: true,
      },
    ],
    teleadjust: [
      {
        id: 19,
        signalName: '频率设定值',
        scaleFactor: 0.01,
        offset: 0.0,
        value: 0,
        unit: 'Hz',
        reverse: false,
        dataType: 'FLOAT32',
        protocolConfig: {
          registerAddress: 'CSWI1.Pos.setVal',
          registerType: 'holding',
          byteOrder: 'big',
          readInterval: 10,
        },
        enabled: true,
      },
    ],
  },
])

// 计算属性
const totalPoints = computed(() => {
  return channels.value.reduce((total, channel) => {
    return (
      total +
      channel.telemetry.length +
      channel.telesignal.length +
      channel.telecontrol.length +
      channel.teleadjust.length
    )
  }, 0)
})

const enabledPoints = computed(() => {
  return channels.value.reduce((total, channel) => {
    const countEnabled = (points: Point[]) => points.filter((point) => point.enabled).length

    return (
      total +
      countEnabled(channel.telemetry) +
      countEnabled(channel.telesignal) +
      countEnabled(channel.telecontrol) +
      countEnabled(channel.teleadjust)
    )
  }, 0)
})

// 添加通道
const addChannel = () => {
  const newChannel = {
    id: Date.now(),
    name: `通道${channels.value.length + 1}`,
    activeTab: 'telemetry' as 'telemetry' | 'telesignal' | 'telecontrol' | 'teleadjust',
    protocol: 'Modbus TCP',
    is_active: true,
    telemetry: [createNewPoint('telemetry')],
    telesignal: [createNewPoint('telesignal')],
    telecontrol: [createNewPoint('telecontrol')],
    teleadjust: [createNewPoint('teleadjust')],
  }
  channels.value.push(newChannel)
  // 自动展开新添加的通道
  activeNames.value = [newChannel.id]
  ElMessage.success('通道添加成功')
}

// 删除通道
const deleteChannel = async (index: number) => {
  try {
    await ElMessageBox.confirm(`确定要删除通道"${channels.value[index].name}"吗？`, '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    channels.value.splice(index, 1)
    ElMessage.success('通道删除成功')
  } catch {
    // 用户取消删除
  }
}

// 添加点位
const addPoint = (
  channel: Channel,
  type: keyof Pick<Channel, 'telemetry' | 'telesignal' | 'telecontrol' | 'teleadjust'>,
) => {
  channel[type].push(createNewPoint(type))
  ElMessage.success('点位添加成功')
}

// 删除点位
const deletePoint = async (
  channel: Channel,
  type: keyof Pick<Channel, 'telemetry' | 'telesignal' | 'telecontrol' | 'teleadjust'>,
  pointIndex: number,
) => {
  try {
    await ElMessageBox.confirm('确定要删除这个点位吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    channel[type].splice(pointIndex, 1)
    ElMessage.success('点位删除成功')
  } catch {
    // 用户取消删除
  }
}

// 更新点位
const updatePoint = (
  channel: Channel,
  type: keyof Pick<Channel, 'telemetry' | 'telesignal' | 'telecontrol' | 'teleadjust'>,
  data: { index: number; point: Partial<Point> },
) => {
  channel[type][data.index] = { ...channel[type][data.index], ...data.point }
}
</script>

<style scoped lang="scss">
.channel-configuration {
  padding: 20px;
  height: 100%;
  overflow: auto;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.25);
    border: 1px solid;
    border-image: linear-gradient(
        117.64deg,
        rgba(148, 166, 197, 0.3) 2.73%,
        rgba(148, 166, 197, 0) 25.27%,
        rgba(148, 166, 197, 0.3) 41.05%,
        rgba(148, 166, 197, 0.103266) 61.63%,
        rgba(148, 166, 197, 0.3) 97.67%
      )
      1;
    backdrop-filter: blur(20px);

    .header-left {
      display: flex;
      align-items: center;
      gap: 20px;

      .title {
        margin: 0;
        color: #fff;
        font-size: 20px;
        font-weight: 600;
      }

      .stats {
        display: flex;
        gap: 12px;

        .channel-count {
          color: #fff;
          font-size: 14px;
          background: #3a5279;
          padding: 4px 12px;
          border-radius: 16px;
          border: 1px solid #3a5279;
        }
      }
    }

    .header-right {
      display: flex;
      gap: 12px;
    }
  }

  .content {
    .channel-collapse-item {
      margin-bottom: 16px;

      .channel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        .channel-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
          .channel-title {
            font-weight: 600;
            color: #fff;
            font-size: 16px;
          }
        }
        .channel-header-right {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-right: 20px;
          color: #fff;
        }
      }

      .channel-content {
        // background-color: rgba(84, 98, 140, 0.2);
        padding: 20px;
      }
    }
  }
  :deep(.el-tabs__content) {
    position: static;
  }
}
</style>
