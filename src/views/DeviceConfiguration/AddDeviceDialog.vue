<template>
  <FormDialog title="添加设备模型" width="8.34rem" ref="dialogRef" @close="handleClose">
    <template #dialog-body>
      <el-form
        ref="formRef"
        :model="form"
        inline
        :rules="rules"
        label-width="1rem"
        class="add-model-form"
      >
        <div class="form-section">
          <el-form-item label="模型名称:" prop="name">
            <el-input
              v-model="form.name"
              placeholder="请输入模型名称"
              style="width: 6.36rem !important"
            />
          </el-form-item>
          <el-form-item label="描述:" prop="description">
            <el-input
              v-model="form.description"
              placeholder="请输入模型描述"
              type="textarea"
              :rows="3"
              style="width: 6.36rem !important"
            />
          </el-form-item>
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
import { fa } from 'element-plus/es/locales.mjs'
import type { ModelForm, DialogExpose } from '@/types/deviceConfiguration'

const formRef = ref<FormInstance>()
const dialogRef = ref<DialogExpose>()

// 表单数据
const form = ref<ModelForm>({
  name: '',
  description: '',
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入模型名称', trigger: 'blur' },
    { min: 2, max: 32, message: '模型名称长度为2-32个字符', trigger: 'blur' },
  ],
}

// 打开对话框
const open = () => {
  form.value = {
    name: '',
    description: '',
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

// 关闭对话框
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
      ElMessage.success('设备模型添加成功')
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
  (e: 'submit', model: ModelForm): void
  (e: 'cancel'): void
}>()

// 暴露方法
defineExpose({ open, close })
</script>

<style scoped lang="scss">
.add-model-form {
  .form-section {
  }
}
</style>
