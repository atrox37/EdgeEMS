<script setup lang="ts">
import en from 'element-plus/es/locale/lang/en'
import wsManager from '@/utils/websocket'
import { useRouter } from 'vue-router'
import { nextTick } from 'vue'
import { useGlobalStore } from '@/stores/global'

const globalStore = useGlobalStore()
const locale = en
const router = useRouter()

// 处理告警详情跳转
const handleAlarmDetail = () => {
  ElMessage.closeAll()
  // 跳转到currentRecords页面
  router.push({ name: 'alarmCurrentRecords' })
}
let idCount = 0
const alarmMap = new Map()
// 初始化WebSocket连接
const initWebSocket = async () => {
  try {
    await wsManager.connect()
    console.log('[main] WebSocket连接成功')

    // 设置全局监听器
    wsManager.setGlobalListeners({
      onConnect: () => {
        console.log('[main] WebSocket已连接')
      },
      onDisconnect: () => {
        console.log('[main] WebSocket连接断开')
      },
      onError: (error) => {
        console.error('[main] WebSocket错误:', error)
      },
      onAlarm: (alarm) => {
        if (alarm.status == 1) {
          // 这里用自定义HTML和事件代理实现按钮跳转
          nextTick(() => {
            const message = ElMessage({
              type: 'error',
              showClose: true,
              dangerouslyUseHTMLString: true,
              // placement: 'top-right',
              message: `
                <div style="display: flex; align-items: center; gap: 0.08rem;">
                  <span>${alarm.message}</span>
                  <button id="to-detail-btn-${idCount}" style="padding:0.04rem 0.1rem;background-color: #ff6900; color: #fff; border: none;  cursor: pointer;font-size:0.14rem;}">to detail</button>
                </div>
              `,
              duration: 0,
              onClose: () => {
                // 可选：关闭时移除事件监听
                const btn = document.getElementById(`to-detail-btn-${idCount}`)
                if (btn) btn.removeEventListener('click', handleAlarmDetail)
              },
            })
            alarmMap.set(alarm.alarm_id, message)
            // 事件代理，监听按钮点击
            nextTick(() => {
              const btn = document.getElementById(`to-detail-btn-${idCount}`)
              if (btn) {
                btn.addEventListener('click', handleAlarmDetail)
              }
            })
          })
        } else {
          ElMessage.success({
            message: alarm.message,
            duration: 3000,
          })
          alarmMap.get(alarm.alarm_id)?.close()
        }
        console.log('[main] 告警:', alarm)
      },
      onAlarmNum: (alarmNum) => {
        console.log('[main] 告警数量更新:', alarmNum)
        globalStore.alarmNum = alarmNum.current_alarms
      },
    })
  } catch (error) {
    console.error('[main] WebSocket连接失败:', error)
  }
}
initWebSocket()
</script>

<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  box-sizing: border-box;
}

#app {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: relative;
}
</style>
