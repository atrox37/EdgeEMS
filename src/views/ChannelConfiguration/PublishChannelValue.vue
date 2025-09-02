<template>
  <FormDialog title="Publish Real-time Data" width="4.6rem" ref="dialogRef">
    <template #dialog-body>
      <el-form :model="form" label-width="1rem" ref="formRef">
        <el-form-item label="Publish Data:">
          <el-input-number :controls="false" v-model="form.channelName" placeholder="Please enter publish data" :min="0"
            :max="100" />
        </el-form-item>
      </el-form>
    </template>
    <template #dialog-footer>
      <el-button type="primary" @click="handlePublish">Publish</el-button>
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
