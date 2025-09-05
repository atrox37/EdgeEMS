<template>
  <div class="voltage-class channel-configuration">
    <!-- Header -->
    <div class="header">
      <div class="header-left">
        <h2 class="title">Communication Channel List</h2>
        <div class="stats">
          <span class="channel-count">number of channels: {{ channels.length }}</span>
        </div>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="addChannel">
          <el-icon>
            <Plus />
          </el-icon>
          add channel
        </el-button>
      </div>
    </div>

    <!-- Content -->
    <div class="content">
      <el-collapse v-model="activeNames" accordion expand-icon-position="left">
        <el-collapse-item v-for="(channel, index) in channels" :key="channel.id" :name="channel.id"
          class="channel-collapse-item">
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
                <div class="channel-header-right-item">YC: {{ channel.telemetry.length }}</div>
                <div class="channel-header-right-item">YX: {{ channel.telesignal.length }}</div>
                <div class="channel-header-right-item">YK: {{ channel.telecontrol.length }}</div>
                <div class="channel-header-right-item">YT: {{ channel.teleadjust.length }}</div>
              </div>
            </div>
          </template>

          <!-- 展开内容 -->
          <div class="channel-content">
            <el-tabs v-model="channel.activeTab" type="card">
              <el-tab-pane label="YC" name="telemetry">
                <PointTable channel_type="telemetry" :points="channel.telemetry" title="YC Points Information"
                  :channelId="channel.id" />
              </el-tab-pane>
              <el-tab-pane label="YX" name="telesignal">
                <PointTable channel_type="telesignal" :points="channel.telesignal" title="YX Points Information"
                  :channelId="channel.id" />
              </el-tab-pane>
              <el-tab-pane label="YK" name="telecontrol">
                <PointTable channel_type="telecontrol" :points="channel.telecontrol" title="YK Points Information"
                  :channelId="channel.id" />
              </el-tab-pane>
              <el-tab-pane label="YT" name="teleadjust">
                <PointTable channel_type="teleadjust" :points="channel.teleadjust" title="YT Points Information"
                  :channelId="channel.id" />
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- 添加通道对话�?-->
    <AddChannelDialog ref="addChannelDialogRef" @submit="handleAddChannelSubmit" @cancel="handleAddChannelCancel" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { Channel, Point } from '@/types/channelConfiguration'
import AddChannelDialog from './AddChannelDialog.vue'
import PointTable from './PointTable.vue'

// 当前激活的折叠面板
const activeNames = ref<number[]>([1])

// 通道数据
const channels = ref<Channel[]>([
  {
    id: 1,
    name: 'Modbus TCP Channel 1',
    activeTab: 'telemetry',
    protocol: 'Modbus TCP',
    is_active: true,
    telemetry: [
      {
        id: 1,
        signalName: 'Voltage A',
        scaleFactor: 0.1,
        offset: 0.0,
        value: 0,
        unit: 'V',
        reverse: false,
        dataType: 'FLOAT32',
        protocolConfig: {
          slave_id: 1,
          function_code: 3,
          register_address: 40001,
          data_type: 'FLOAT32',
          byte_order: 'ABCD',
          bit_position: undefined,
        },
        enabled: true,
      },
      {
        id: 2,
        signalName: 'Voltage B',
        scaleFactor: 0.1,
        offset: 0.0,
        value: 0,
        unit: 'V',
        reverse: false,
        dataType: 'FLOAT32',
        protocolConfig: {
          slave_id: 1,
          function_code: 3,
          register_address: 40002,
          data_type: 'FLOAT32',
          byte_order: 'ABCD',
          bit_position: undefined,
        },
        enabled: true,
      },
      {
        id: 3,
        signalName: 'Voltage C',
        scaleFactor: 0.1,
        offset: 0.0,
        value: 0,
        unit: 'V',
        reverse: false,
        dataType: 'FLOAT32',
        protocolConfig: {
          slave_id: 1,
          function_code: 3,
          register_address: 40003,
          data_type: 'FLOAT32',
          byte_order: 'ABCD',
          bit_position: undefined,
        },
        enabled: true,
      },
    ],
    telesignal: [
      {
        id: 4,
        signalName: 'Circuit Breaker Status',
        value: 0,
        unit: '',
        dataType: 'BOOLEAN',
        protocolConfig: {
          slave_id: 1,
          function_code: 3,
          register_address: 1,
          data_type: 'BOOLEAN',
          byte_order: 'AB',
          bit_position: 0,
        },
        enabled: true,
      },
      {
        id: 5,
        signalName: 'Protection Action',
        value: 0,
        unit: '',
        dataType: 'BOOLEAN',
        protocolConfig: {
          slave_id: 1,
          function_code: 3,
          register_address: 2,
          data_type: 'BOOLEAN',
          byte_order: 'AB',
          bit_position: 1,
        },
        enabled: true,
      },
    ],
    telecontrol: [
      {
        id: 6,
        signalName: 'Circuit Breaker Close',
        value: 0,
        unit: '',
        dataType: 'BOOLEAN',
        protocolConfig: {
          slave_id: 1,
          function_code: 3,
          register_address: 1,
          data_type: 'BOOLEAN',
          byte_order: 'AB',
          bit_position: 0,
        },
        enabled: true,
      },
    ],
    teleadjust: [
      {
        id: 7,
        signalName: 'Voltage Setting',
        value: 0,
        unit: 'V',
        dataType: 'FLOAT32',
        protocolConfig: {
          slave_id: 1,
          function_code: 3,
          register_address: 40010,
          data_type: 'FLOAT32',
          byte_order: 'ABCD',
          bit_position: undefined,
        },
        enabled: true,
      },
    ],
  },
  {
    id: 2,
    name: 'Modbus RTU Channel 2',
    activeTab: 'telemetry',
    protocol: 'Modbus RTU',
    is_active: true,
    telemetry: [
      {
        id: 8,
        signalName: 'Current A',
        scaleFactor: 0.01,
        offset: 0.0,
        value: 0,
        unit: 'A',
        reverse: false,
        dataType: 'FLOAT32',
        protocolConfig: {
          slave_id: 2,
          function_code: 4,
          register_address: 30001,
          data_type: 'FLOAT32',
          byte_order: 'CDAB',
          bit_position: undefined,
        },
        enabled: true,
      },
      {
        id: 9,
        signalName: 'Current B',
        scaleFactor: 0.01,
        offset: 0.0,
        value: 0,
        unit: 'A',
        reverse: false,
        dataType: 'FLOAT32',
        protocolConfig: {
          slave_id: 2,
          function_code: 4,
          register_address: 30002,
          data_type: 'FLOAT32',
          byte_order: 'CDAB',
          bit_position: undefined,
        },
        enabled: true,
      },
      {
        id: 10,
        signalName: 'Current C',
        scaleFactor: 0.01,
        offset: 0.0,
        value: 0,
        unit: 'A',
        reverse: false,
        dataType: 'FLOAT32',
        protocolConfig: {
          slave_id: 2,
          function_code: 4,
          register_address: 30003,
          data_type: 'FLOAT32',
          byte_order: 'CDAB',
          bit_position: undefined,
        },
        enabled: true,
      },
      {
        id: 11,
        signalName: 'Active Power',
        scaleFactor: 0.1,
        offset: 0.0,
        value: 0,
        unit: 'kW',
        reverse: false,
        dataType: 'FLOAT32',
        protocolConfig: {
          slave_id: 2,
          function_code: 4,
          register_address: 30010,
          data_type: 'FLOAT32',
          byte_order: 'CDAB',
          bit_position: undefined,
        },
        enabled: true,
      },
    ],
    telesignal: [
      {
        id: 12,
        signalName: 'Device Online Status',
        value: 0,
        unit: '',
        dataType: 'BOOLEAN',
        protocolConfig: {
          slave_id: 2,
          function_code: 4,
          register_address: 10001,
          data_type: 'BOOLEAN',
          byte_order: 'AB',
          bit_position: 0,
        },
        enabled: true,
      },
    ],
    telecontrol: [
      {
        id: 13,
        signalName: 'Device Restart',
        value: 0,
        unit: '',
        dataType: 'BOOLEAN',
        protocolConfig: {
          slave_id: 2,
          function_code: 3,
          register_address: 10,
          data_type: 'BOOLEAN',
          byte_order: 'AB',
          bit_position: 0,
        },
        enabled: false,
      },
    ],
    teleadjust: [
      {
        id: 14,
        signalName: 'Current Threshold Setting',
        scaleFactor: 0.01,
        offset: 0.0,
        value: 0,
        unit: 'A',
        reverse: false,
        dataType: 'FLOAT32',
        protocolConfig: {
          slave_id: 2,
          function_code: 3,
          register_address: 40020,
          data_type: 'FLOAT32',
          byte_order: 'CDAB',
          bit_position: undefined,
        },
        enabled: true,
      },
    ],
  },
  {
    id: 3,
    name: 'IEC61850 Channel 3',
    activeTab: 'telemetry',
    protocol: 'IEC61850',
    is_active: true,
    telemetry: [
      {
        id: 15,
        signalName: 'Frequency',
        scaleFactor: 0.01,
        offset: 0.0,
        value: 0,
        unit: 'Hz',
        reverse: false,
        dataType: 'FLOAT32',
        protocolConfig: {
          slave_id: 3,
          function_code: 3,
          register_address: 1001,
          data_type: 'FLOAT32',
          byte_order: 'ABCD',
          bit_position: undefined,
        },
        enabled: true,
      },
      {
        id: 16,
        signalName: 'Power Factor',
        scaleFactor: 0.001,
        offset: 0.0,
        value: 0,
        unit: '',
        reverse: false,
        dataType: 'FLOAT32',
        protocolConfig: {
          slave_id: 3,
          function_code: 3,
          register_address: 1002,
          data_type: 'FLOAT32',
          byte_order: 'ABCD',
          bit_position: undefined,
        },
        enabled: true,
      },
    ],
    telesignal: [
      {
        id: 17,
        signalName: 'Protection Trip',
        value: 0,
        unit: '',
        dataType: 'BOOLEAN',
        protocolConfig: {
          slave_id: 3,
          function_code: 3,
          register_address: 2001,
          data_type: 'BOOLEAN',
          byte_order: 'AB',
          bit_position: 0,
        },
        enabled: true,
      },
    ],
    telecontrol: [
      {
        id: 18,
        signalName: 'Switch Control',
        value: 0,
        unit: '',
        dataType: 'BOOLEAN',
        protocolConfig: {
          slave_id: 3,
          function_code: 3,
          register_address: 3001,
          data_type: 'BOOLEAN',
          byte_order: 'AB',
          bit_position: 0,
        },
        enabled: true,
      },
    ],
    teleadjust: [
      {
        id: 19,
        signalName: 'Frequency Setting',
        scaleFactor: 0.01,
        offset: 0.0,
        value: 0,
        unit: 'Hz',
        reverse: false,
        dataType: 'FLOAT32',
        protocolConfig: {
          slave_id: 3,
          function_code: 3,
          register_address: 4001,
          data_type: 'FLOAT32',
          byte_order: 'ABCD',
          bit_position: undefined,
        },
        enabled: true,
      },
    ],
  },
])

// 计算属性
const totalPoints = computed(() => {
  return channels.value.reduce((total: number, channel: Channel) => {
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
  return channels.value.reduce((total: number, channel: Channel) => {
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

// 添加通道对话框引用
const addChannelDialogRef = ref()

// 添加通道
const addChannel = () => {
  addChannelDialogRef.value?.open()
}

// 处理添加通道对话框提交
const handleAddChannelSubmit = (channelData: {
  name: string
  protocol: string
  is_active: boolean
  ip_address: string
  port: number | null
  timeout: number | null
  unit_id: number | null
}) => {
  const newChannel = {
    id: Date.now(),
    name: channelData.name,
    activeTab: 'telemetry' as 'telemetry' | 'telesignal' | 'telecontrol' | 'teleadjust',
    protocol: channelData.protocol,
    is_active: channelData.is_active,
    // 点位都为空数组
    telemetry: [],
    telesignal: [],
    telecontrol: [],
    teleadjust: [],
  }
  channels.value.push(newChannel)
  // 自动展开新添加的通道
  activeNames.value = [newChannel.id]
}

// 处理添加通道对话框取消
const handleAddChannelCancel = () => {
  // 用户取消添加，不需要做任何操作
}
</script>

<style scoped lang="scss">
.channel-configuration {
  padding: 0.2rem;
  height: 100%;
  overflow: auto;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.2rem;
    padding: 0.2rem;
    border-radius: 0.08rem;
    box-shadow: 0rem 0.04rem 0.1rem 0rem rgba(0, 0, 0, 0.25);
    border: 0.01rem solid;
    border-image: linear-gradient(117.64deg,
        rgba(148, 166, 197, 0.3) 2.73%,
        rgba(148, 166, 197, 0) 25.27%,
        rgba(148, 166, 197, 0.3) 41.05%,
        rgba(148, 166, 197, 0.103266) 61.63%,
        rgba(148, 166, 197, 0.3) 97.67%) 1;
    backdrop-filter: blur(0.2rem);

    .header-left {
      display: flex;
      align-items: center;
      gap: 0.2rem;

      .title {
        margin: 0;
        color: #fff;
        font-size: 0.2rem;
        font-weight: 600;
      }

      .stats {
        display: flex;
        gap: 0.12rem;

        .channel-count {
          color: #fff;
          font-size: 0.14rem;
          background: #3a5279;
          padding: 0.04rem 0.12rem;
          border-radius: 0.16rem;
          border: 0.01rem solid #3a5279;
        }
      }
    }

    .header-right {
      display: flex;
      gap: 0.12rem;
    }
  }

  .content {
    .channel-collapse-item {
      margin-bottom: 0.16rem;

      .channel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        .channel-header-left {
          display: flex;
          align-items: center;
          gap: 0.1rem;

          .channel-title {
            font-weight: 600;
            color: #fff;
            font-size: 0.16rem;
          }
        }

        .channel-header-right {
          display: flex;
          align-items: center;
          gap: 0.12rem;
          margin-right: 0.2rem;
          color: #fff;
        }
      }

      .channel-content {
        // background-color: rgba(84, 98, 140, 0.2);
        padding: 0.2rem;
      }
    }
  }

  :deep(.el-tabs__content) {
    position: static;
  }
}
</style>
