<template>
  <!-- 协议配置对话框 -->
  <FormDialog ref="formDialogRef" title="协议配置" width="8.4rem">
    <template #dialog-body>
      <div class="protocol-config">
        <el-form :model="currentProtocolConfig" label-width="1rem" inline :rules="rules">
          <el-form-item label="寄存器地址:">
            <el-input
              v-model="currentProtocolConfig.registerAddress"
              placeholder="请输入寄存器地址"
            />
          </el-form-item>
          <el-form-item label="寄存器类型:" style="margin-right: 0">
            <el-select v-model="currentProtocolConfig.registerType" placeholder="选择寄存器类型">
              <el-option
                v-for="type in REGISTER_TYPES"
                :key="type.value"
                :label="type.label"
                :value="type.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="字节序:">
            <el-select v-model="currentProtocolConfig.byteOrder" placeholder="选择字节序">
              <el-option
                v-for="order in BYTE_ORDERS"
                :key="order.value"
                :label="order.label"
                :value="order.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="读取间隔(秒):" style="margin-right: 0">
            <el-input-number
              v-model="currentProtocolConfig.readInterval"
              :min="1"
              :max="3600"
              :controls="false"
            />
          </el-form-item>
        </el-form>
      </div>
    </template>
    <template #dialog-footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="saveProtocolConfig">确定</el-button>
      </div>
    </template>
  </FormDialog>
</template>

<script setup lang="ts">
import type { ProtocolConfig } from '@/types/channelConfiguration'
import { REGISTER_TYPES, BYTE_ORDERS } from '@/types/channelConfiguration'
import FormDialog from '@/components/dialog/FormDialog.vue'

const props = defineProps<{
  currentProtocolConfig: ProtocolConfig
}>()

const formDialogRef = ref()
const rules = ref({
  registerAddress: [{ required: true, message: '请输入寄存器地址' }],
  registerType: [{ required: true, message: '请选择寄存器类型' }],
  byteOrder: [{ required: true, message: '请选择字节序' }],
  readInterval: [{ required: true, message: '请输入读取间隔' }],
})
// 保存协议配置
const saveProtocolConfig = () => {}
function open() {
  formDialogRef.value.dialogVisible = true
}
function close() {
  formDialogRef.value.dialogVisible = false
}
defineExpose({ open, close })
</script>

<style scoped lang="scss"></style>
