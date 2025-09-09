<template>
  <div class="voltage-class data-update-setting">
    <ModuleCard title="Data Upload" :isShowFooter="true" @submit="handleSubmit">
      <el-form ref="formRef" :model="formData" :rules="rules" class="data-update-form" label-width="1.35rem"
        label-position="right">
        <!-- 总开关 -->
        <el-form-item label="Connected:">
          <el-switch v-model="connected" @change="handleEnableChange" />
        </el-form-item>

        <!-- 折叠面板配置 -->
        <el-collapse v-model="activeCollapse" class="config-collapse" expandIconPosition="left">
          <!-- 基础配置模块 -->
          <el-collapse-item name="basic" title="Basic Configuration">
            <template #title>
              <div class="collapse-title">
                <span class="collapse-title__text">Basic Configuration</span>
              </div>
            </template>
            <div class="collapse-content">
              <el-form-item label="Client ID:" prop="client_id">
                <el-input v-model="formData.client_id" placeholder="Enter client ID" />
              </el-form-item>
              <el-form-item label="Host:" prop="host">
                <el-input v-model="formData.host" placeholder="Enter host address" />
              </el-form-item>
              <el-form-item label="Port:" prop="port">
                <el-input-number v-model="formData.port" :min="1" :max="65535" :controls="false" align="left"
                  placeholder="Enter port number" style="width: 100%" />
              </el-form-item>
              <el-form-item label="Username:" prop="username">
                <el-input v-model="formData.username" placeholder="Enter username" />
              </el-form-item>
              <el-form-item label="Password:" prop="password">
                <el-input v-model="formData.password" type="password" placeholder="Enter password" show-password />
              </el-form-item>
            </div>
          </el-collapse-item>

          <!-- SSL配置模块 -->
          <el-collapse-item name="ssl" title="SSL Configuration">
            <template #title>
              <div class="collapse-title">
                <span class="collapse-title__text">SSL Configuration</span>
              </div>
            </template>
            <div class="collapse-content">
              <el-form-item label="Enable:" prop="ssl.enabled">
                <el-switch v-model="formData.ssl.enabled" />
              </el-form-item>
              <template v-if="formData.ssl.enabled">
                <el-form-item label="CA Certificate:" prop="ssl.ca_cert">
                  <el-input v-model="formData.ssl.ca_cert" placeholder="Enter CA certificate" />
                </el-form-item>
                <el-form-item label="Client Certificate:" prop="ssl.client_cert">
                  <el-input v-model="formData.ssl.client_cert" placeholder="Enter client certificate" />
                </el-form-item>
                <el-form-item label="Client Key:" prop="ssl.client_key">
                  <el-input v-model="formData.ssl.client_key" placeholder="Enter client key" />
                </el-form-item>
              </template>
            </div>
          </el-collapse-item>

          <!-- 重连配置模块 -->
          <el-collapse-item name="reconnect" title="Reconnect Configuration">
            <template #title>
              <div class="collapse-title">
                <span class="collapse-title__text">Reconnect Configuration</span>
              </div>
            </template>
            <div class="collapse-content">
              <el-form-item label="Enable:" prop="reconnect.enabled">
                <el-switch v-model="formData.reconnect.enabled" />
              </el-form-item>
              <template v-if="formData.reconnect.enabled">
                <el-form-item label="Delay (seconds):" prop="reconnect.delay">
                  <el-input-number v-model="formData.reconnect.delay" :min="1" :max="3600" :controls="false"
                    align="left" placeholder="Enter delay in seconds" style="width: 100%" />
                </el-form-item>
                <el-form-item label="Max Attempts:" prop="reconnect.max_attempts">
                  <el-input-number v-model="formData.reconnect.max_attempts" :min="1" :max="100" :controls="false"
                    align="left" placeholder="Enter max attempts" style="width: 100%" />
                </el-form-item>
              </template>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </ModuleCard>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { getMqttConfig, updateMqttConfig, disconnectMqtt, reconnectMqtt, getMqttStatus } from '@/api/System'
const formRef = ref<FormInstance>()

// 折叠面板控制
const activeCollapse = ref<string[]>(['basic']) // 默认展开基础配置


interface FormData {
  port: number
  host: string
  username: string
  password: string
  client_id: string


  ssl: {
    enabled: boolean
    ca_cert: string | null
    client_cert: string | null
    client_key: string | null
  }
  reconnect: {
    enabled: boolean
    delay: number
    max_attempts: number
  }
  status: {
    will_message_enabled: boolean
    auto_online_message: boolean
  }
}
const connected = ref(false)
const formData = ref<FormData>({
  port: 502,
  host: '192.168.1.100',
  username: '',
  password: '',
  client_id: '',
  ssl: {
    enabled: false,
    ca_cert: null,
    client_cert: null,
    client_key: null,
  },
  reconnect: {
    enabled: false,
    delay: 10,
    max_attempts: 3,
  },
  status: {
    will_message_enabled: true,
    auto_online_message: true
  }
})

// 表单验证规则
const rules = ref<FormRules<FormData>>({
  'client_id': [
    { required: true, message: 'Please enter client ID', trigger: 'blur' },
    { min: 1, max: 50, message: 'Client ID length should be 1-50 characters', trigger: 'blur' }
  ],
  'host': [
    { required: true, message: 'Please enter host address', trigger: 'blur' },
    // {
    //   pattern: /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    //   message: 'Please enter a valid host address (IP or domain)',
    //   trigger: 'blur'
    // }
  ],
  'port': [
    { required: true, message: 'Please enter port number', trigger: 'blur' },
    { type: 'number', min: 1, max: 65535, message: 'Port must be between 1 and 65535', trigger: 'blur' }
  ],
  'username': [
    { required: true, message: 'Please enter username', trigger: 'blur' },
    // { min: 1, max: 50, message: 'Username length should be 1-50 characters', trigger: 'blur' }
  ],
  'password': [
    { required: true, message: 'Please enter password', trigger: 'blur' },
    // { min: 6, max: 100, message: 'Password length should be 6-100 characters', trigger: 'blur' }
  ],
  'ssl.enabled': [
    { required: true, message: 'Please select SSL enable status', trigger: 'change' }
  ],
  'ssl.ca_cert': [
    {
      validator: (rule, value, callback) => {
        if (formData.value.ssl.enabled && (!value || value.trim() === '')) {
          callback(new Error('CA Certificate is required when SSL is enabled'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  'ssl.client_cert': [
    {
      validator: (rule, value, callback) => {
        if (formData.value.ssl.enabled && (!value || value.trim() === '')) {
          callback(new Error('Client Certificate is required when SSL is enabled'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  'ssl.client_key': [
    {
      validator: (rule, value, callback) => {
        if (formData.value.ssl.enabled && (!value || value.trim() === '')) {
          callback(new Error('Client Key is required when SSL is enabled'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  'reconnect.enabled': [
    { required: true, message: 'Please select reconnect enable status', trigger: 'change' }
  ],
  'reconnect.delay': [
    {
      validator: (rule, value, callback) => {
        if (formData.value.reconnect.enabled && (!value || value < 1 || value > 360000)) {
          callback(new Error('Delay must be between 1 and 360000 seconds when reconnect is enabled'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  'reconnect.max_attempts': [
    {
      validator: (rule, value, callback) => {
        if (formData.value.reconnect.enabled && (!value || value < 1 || value > 10000)) {
          callback(new Error('Max attempts must be between 1 and 10000 when reconnect is enabled'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
})

// 表单提交方法
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    console.log('Form data:', formData.value)
    // 这里可以添加提交到后端的逻辑
    ElMessage.success('Configuration saved successfully!')
    await updateMqttConfig({ mqtt_connection: { broker: formData.value } })
  } catch (error) {
    console.error('Form validation failed:', error)
    ElMessage.error('Please check the form data')
  }
}


onMounted(async () => {
  const response = await getMqttConfig()
  formData.value = response.data.broker
  const statusResponse = await getMqttStatus()
  connected.value = statusResponse.connected
})

const handleEnableChange = async (value: boolean) => {
  connected.value = !value
  if (value) {
    const response = await reconnectMqtt()
    if (response.status == 'failed') {
      connected.value = false
      ElMessage.error(response.message)
    }
    else {
      connected.value = true
      ElMessage.success(response.message)
    }
  } else {

    const response = await disconnectMqtt()
    if (response.status == 'failed') {
      connected.value = true
      ElMessage.error(response.message)
    }
    else {
      connected.value = false
      ElMessage.success(response.message)
    }
  }
}

</script>

<style scoped lang="scss">
.data-update-setting {
  width: 100%;
  height: 100%;

  .data-update-form {
    width: 100%;
    height: 100%;
    margin: 0.2rem 0;
    overflow-y: auto;

    // 折叠面板样式
    .config-collapse {
      border: none;
      background: transparent;

      &>div {
        margin-bottom: 0.2rem;

        &:last-child {
          margin-bottom: 0;
        }
      }

      // :deep(.el-collapse-item) {
      //   margin-bottom: 0.2rem;
      //   border: 1px solid rgba(255, 255, 255, 0.1);
      //   border-radius: 0.08rem;
      //   overflow: hidden;
      //   background: rgba(44, 66, 106, 0.1);

      //   .el-collapse-item__header {
      //     background: linear-gradient(90deg, rgba(44, 66, 106, 0.8) 0%, rgba(44, 66, 106, 0.4) 100%);
      //     color: #ffffff;
      //     font-size: 0.16rem;
      //     font-weight: 600;
      //     padding: 0.12rem 0.2rem;
      //     border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      //     height: auto;
      //     line-height: 1.5;

      //     .el-collapse-item__arrow {
      //       color: #ffffff;
      //       font-size: 0.14rem;
      //       margin-right: 0.1rem;
      //     }

      //     &:hover {
      //       background: linear-gradient(90deg, rgba(44, 66, 106, 0.9) 0%, rgba(44, 66, 106, 0.5) 100%);
      //     }
      //   }

      //   .el-collapse-item__wrap {
      //     border: none;
      //     background: transparent;

      //     .el-collapse-item__content {
      //       padding: 0;
      //       background: rgba(44, 66, 106, 0.1);
      //     }
      //   }
      // }
    }

    // 折叠面板标题样式
    .collapse-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding-right: 0.1rem;

      .collapse-title__text {
        flex: 1;
        font-size: 0.16rem;
        font-weight: 600;
        color: #ffffff;
      }
    }

    // 折叠面板内容样式
    .collapse-content {
      padding: 0.2rem;

      .el-form-item {
        margin-bottom: 0.2rem;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    // 输入框样式优化
    :deep(.el-input) {
      width: 100% !important;
    }

  }
}
</style>