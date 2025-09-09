<template>
  <!-- 协议配置对话框 -->
  <FormDialog ref="formDialogRef" title="Protocol Configuration" width="8.74rem">
    <template #dialog-body>
      <div class="protocol-config">
        <el-form :model="currentProtocolConfig" label-width="1.1rem" inline :rules="rules">
          <el-form-item label="Slave ID:">
            <el-input-number v-model="currentProtocolConfig.slave_id" :min="1" :max="247" :controls="false" align="left"
              placeholder="1-247" />
          </el-form-item>
          <el-form-item label="Function Code:" style="margin-right: 0">
            <el-select v-model="currentProtocolConfig.function_code" placeholder="Select function code">
              <el-option v-for="code in FUNCTION_CODES" :key="code.value" :label="code.label" :value="code.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="Register Address:">
            <el-input-number v-model="currentProtocolConfig.register_address" :min="0" :max="65535" :controls="false"
              align="left" placeholder="0-65535" />
          </el-form-item>
          <el-form-item label="Data Type:" style="margin-right: 0">
            <el-select v-model="currentProtocolConfig.data_type" placeholder="Select data type">
              <el-option v-for="type in DATA_TYPES" :key="type.value" :label="type.label" :value="type.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="Byte Order:">
            <el-select v-model="currentProtocolConfig.byte_order" placeholder="Select byte order">
              <el-option v-for="order in BYTE_ORDERS" :key="order.value" :label="order.label" :value="order.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="Bit Position:" style="margin-right: 0">
            <el-input-number v-model="currentProtocolConfig.bit_position" :min="0" :max="15" :controls="false"
              align="left" placeholder="0-15 (optional)" />
          </el-form-item>
        </el-form>
      </div>
    </template>
    <template #dialog-footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="saveProtocolConfig">Confirm</el-button>
      </div>
    </template>
  </FormDialog>
</template>

<script setup lang="ts">
import type { ProtocolConfig } from '@/types/channelConfiguration'
import { DATA_TYPES } from '@/types/channelConfiguration'
import FormDialog from '@/components/dialog/FormDialog.vue'

// 功能码选项
const FUNCTION_CODES = [
  // { label: 'Read the save register(0x03)', value: 3 },
  // { label: 'Read the input register(0x04)', value: 4 },
  { label: 'A', value: 1 },
  { label: 'B', value: 2 },
  { label: 'C', value: 3 },
  { label: 'D', value: 4 },
] as const

// 字节序选项（根据数据类型动态显示）
const BYTE_ORDERS = [
  { label: 'Desc (High byte first)', value: 'Desc' },
  { label: 'Asc (Low byte first)', value: 'Asc' },
  // { label: 'ABCD (32-bit big endian)', value: 'ABCD' },
  // { label: 'CDAB (32-bit little endian)', value: 'CDAB' },
  // { label: 'BADC (32-bit mixed endian)', value: 'BADC' },
  // { label: 'DCBA (32-bit reverse endian)', value: 'DCBA' },
] as const

const props = defineProps<{
  currentProtocolConfig: ProtocolConfig
}>()

const formDialogRef = ref()
const rules = ref({
  slave_id: [
    { required: true, message: 'Please enter slave ID' },
    { type: 'number', min: 1, max: 247, message: 'Slave ID must be between 1 and 247' }
  ],
  function_code: [
    { required: true, message: 'Please select function code' }
  ],
  register_address: [
    { required: true, message: 'Please enter register address' },
    { type: 'number', min: 0, max: 65535, message: 'Register address must be between 0 and 65535' }
  ],
  data_type: [
    { required: true, message: 'Please select data type' }
  ],
  byte_order: [
    { required: true, message: 'Please select byte order' }
  ],
  bit_position: [
    { type: 'number', min: 0, max: 15, message: 'Bit position must be between 0 and 15' }
  ],
})

// 保存协议配置
const saveProtocolConfig = () => { }

function open() {
  formDialogRef.value.dialogVisible = true
}

function close() {
  formDialogRef.value.dialogVisible = false
}

defineExpose({ open, close })
</script>

<style scoped lang="scss">
.protocol-config {
  padding: 0.1rem;

  .el-form-item {
    margin-bottom: 0.16rem;
  }
}

.dialog-footer {
  text-align: right;
  padding-top: 0.1rem;
}
</style>
