<template>
  <FormDialog title="发布实时数据" width="4.6rem" ref="dialogRef">
    <template #dialog-body>
      <el-form :model="form" label-width="1rem" ref="formRef">
        <el-form-item label="发布数据:">
          <el-input-number
            :controls="false"
            v-model="form.channelName"
            placeholder="请输入发布数据"
            :min="0"
            :max="100"
          />
        </el-form-item>
      </el-form>
    </template>
    <template #dialog-footer>
      <el-button type="primary" @click="handlePublish">发布</el-button>
    </template>
  </FormDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  channelName: 0,
})
const formRef = ref()
const dialogRef = ref()
const emit = defineEmits<{
  (e: 'publish', value: any): void
}>()
const open = () => {
  dialogRef.value.dialogVisible = true
  setTimeout(() => {
    formRef.value?.clearValidate()
  }, 100)
}
const handlePublish = () => {
  console.log(form.value)
  dialogRef.value.dialogVisible = false
  emit('publish', form.value)
}
defineExpose({
  open,
})
</script>

<style scoped lang="scss"></style>
