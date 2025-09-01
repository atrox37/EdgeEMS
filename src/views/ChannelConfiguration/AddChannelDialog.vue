<template>
  <FormDialog title="添加通信通道" width="8.34rem" ref="dialogRef" @close="handleClose">
    <template #dialog-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="1rem" class="add-channel-form" inline>
        <!-- 基本信息 -->
        <div class="form-section">
          <h3 class="section-title">基本信息</h3>
          <el-form-item label="通道名称:" prop="name" style="margin-right: 0">
            <el-input v-model="form.name" placeholder="请输入通道名称" style="width: 6.36rem !important" />
          </el-form-item>

          <el-form-item label="通道协议:" prop="protocol" style="margin-right: 0">
            <el-select v-model="form.protocol" placeholder="请选择协议" style="width: 6.36rem">
              <el-option label="Modbus TCP" value="Modbus TCP" />
              <el-option label="Modbus RTU" value="Modbus RTU" />
              <el-option label="IEC61850" value="IEC61850" />
            </el-select>
          </el-form-item>

          <el-form-item label="是否启动:" prop="is_active">
            <el-switch v-model="form.is_active" />
          </el-form-item>
        </div>

        <!-- 协议配置 -->
        <div class="form-section">
          <h3 class="section-title">协议配置</h3>
          <el-form-item label="IP地址" prop="ip_address">
            <el-input v-model="form.ip_address" placeholder="请输入IP地址" />
          </el-form-item>

          <el-form-item label="端口" prop="port" style="margin-right: 0">
            <el-input v-model="form.port" placeholder="请输入端口号" />
          </el-form-item>

          <el-form-item label="超时时间(ms)" prop="timeout">
            <el-input-number v-model="form.timeout" :min="100" :max="30000" :controls="false" placeholder="请输入超时时"
              style="width: 100%" />
          </el-form-item>

          <el-form-item label="单元标识" prop="unit_id" style="margin-right: 0">
            <el-input v-model="form.unit_id" placeholder="请输入单元标" />
          </el-form-item>
        </div>

        <!-- 协议说明 -->
        <div class="protocol-description">
          <h4 class="description-title">协议说明</h4>
          <p class="description-text">
            Modbus TCP是Modbus协议在TCP/IP网络上的实现，适用于以太网环境，支持远程通信 </p>
        </div>
      </el-form>
    </template>

    <template #dialog-footer>
      <el-button type="warning" @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </template>
  </FormDialog>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { ChannelForm, DialogExpose } from '@/types/channelConfiguration'

const formRef = ref<FormInstance>()
const dialogRef = ref<DialogExpose>()

// 表单数据
const form = ref<ChannelForm>({
  name: '',
  protocol: 'Modbus TCP',
  is_active: true,
  ip_address: '',
  port: 502,
  timeout: 5000,
  unit_id: 1,
})

// 表单验证规则（优化：增加端口、超时时间、单元标识的数值范围校验，IP校验更严格）
const rules = {
  name: [
    { required: true, message: '请输入通道名称', trigger: 'blur' },
    { min: 2, max: 32, message: '通道名称长度1-32个字', trigger: 'blur' },
  ],
  protocol: [{ required: true, message: '请选择通道协议', trigger: 'change' }],
  ip_address: [
    { required: true, message: '请输入IP地址', trigger: 'blur' },
    {
      // 更严格的IP校验
      pattern: /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/,
      message: '请输入正确的IP地址格式',
      trigger: 'blur',
    },
  ],
  port: [
    { required: true, message: '请输入端口号', trigger: 'blur' },
    {
      type: 'number',
      min: 1,
      max: 65535,
      message: '端口号范围为1-65535',
      trigger: 'blur',
    },
  ],
  timeout: [
    { required: true, message: '请输入超时时', trigger: 'blur' },
    {
      type: 'number',
      min: 100,
      max: 30000,
      message: '超时时间范围00-30000毫秒',
      trigger: 'blur',
    },
  ],
  unit_id: [
    { required: true, message: '请输入单元标', trigger: 'blur' },
    {
      type: 'number',
      min: 1,
      max: 255,
      message: '单元标识范围1-255',
      trigger: 'blur',
    },
  ],
}

// 打开对话
const open = () => {
  // 重置表单
  form.value = {
    name: '',
    protocol: 'Modbus TCP',
    is_active: true,
    ip_address: '',
    port: 502,
    timeout: 5000,
    unit_id: 1,
  }

  nextTick(() => {
    setTimeout(() => {
      formRef.value?.clearValidate()
      if (dialogRef.value) {
        dialogRef.value.dialogVisible = true
      }
    }, 100)
  })
}

// 关闭对话
const close = () => {
  if (dialogRef.value) {
    dialogRef.value.dialogVisible = false
  }
}

// 取消
const handleCancel = () => {
  emit('cancel')
  close()
}

// 提交
const handleSubmit = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      emit('submit', form.value)
      ElMessage.success('通道添加成功')
      close()
    }
  })
}

// 关闭事件
const handleClose = () => {
  close()
  emit('cancel')
}

// 定义事件
const emit = defineEmits<{
  (e: 'submit', channel: ChannelForm): void
  (e: 'cancel'): void
}>()

// 暴露方法
defineExpose({ open, close })
</script>

<style scoped lang="scss">
.add-channel-form {
  .form-section {
    .section-title {
      color: #fff;
      font-size: 0.16rem;
      font-weight: 600;
      margin: 0 0 0.16rem 0;
      padding-bottom: 0.08rem;
      border-bottom: 0.01rem solid rgba(255, 255, 255, 0.1);
    }
  }

  .protocol-description {
    margin-bottom: 0.2rem;
    padding: 0.16rem;
    background: rgba(58, 82, 121, 0.3);
    border-radius: 0.08rem;
    border: 0.01rem solid rgba(255, 255, 255, 0.1);

    .description-title {
      color: #fff;
      font-size: 0.14rem;
      font-weight: 600;
      margin: 0 0 0.08rem 0;
    }

    .description-text {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.13rem;
      line-height: 1.5;
      margin: 0;
    }
  }
}
</style>
