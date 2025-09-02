<template>
  <div class="voltage-class user-management">
    <div class="user-management__header">
      <IconButton type="primary" :icon="userAddIcon" text="Add User" custom-class="user-management__add-btn"
        @click="handleAddUser" />
    </div>

    <!-- 用户操作表单 -->
    <UserOperationForm ref="userFormRef" @submit="handleUserSubmit" />
    <div class="user-management__table">
      <LoadingBg :loading="loading">
        <el-table :data="tableData" class="user-management__table-content" align="left" table-layout="fixed">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="username" label="UserName">
            <template #default="{ row }">
              <div class="user-info">
                <div class="user-avatar">
                  <div class="user-avatar-text">{{ getAvatarName(row.username) }}</div>
                </div>
                <div class="user-name">{{ row.username }}</div>
              </div>
            </template>
          </el-table-column>

          <!-- 角色列改为纯文字类型 -->
          <el-table-column prop="role" label="Role" show-overflow-tooltip>
            <template #default="{ row }">
              {{ row.role.name_en }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="Status">
            <template #default="{ row }">
              <el-switch :model-value="row.is_active" disabled />
            </template>
          </el-table-column>
          <el-table-column prop="last_login" label="Last Login" show-overflow-tooltip>
            <template #default="{ row }">
              {{ row.last_login }}
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="Created At" show-overflow-tooltip>
            <template #default="{ row }">
              {{ row.created_at }}
            </template>
          </el-table-column>
          <el-table-column label="Operation" fixed="right" width="220">
            <template #default="{ row }">
              <div class="user-management__operation">
                <div class="user-management__operation-item" @click="handleEdit(row)">
                  <img :src="tableEditIcon" />
                  <span class="user-management__operation-text">Edit</span>
                </div>
                <div class="user-management__operation-item" @click="handleDelete(row)">
                  <img :src="tableDeleteIcon" />
                  <span class="user-management__operation-text">Delete</span>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div class="user-management__pagination">
          <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]" :total="pagination.total" layout="total, sizes, prev, pager, next"
            @size-change="handlePageChange" @current-change="handlePageChange" />
        </div>
      </LoadingBg>
    </div>
  </div>
</template>

<script setup lang="ts">
// 正确引入SVG图标，避免部署后图片加载不出�?
import userAddIcon from '@/assets/icons/user-add.svg'
import tableEditIcon from '@/assets/icons/table-edit.svg'
import tableDeleteIcon from '@/assets/icons/table-delect.svg'

import type { UserManagementInfo } from '@/types/user'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { useTableData, type TableConfig } from '@/composables/useTableData'
import UserOperationForm from './UserOperationForm.vue'

// 表格配置
const tableConfig: TableConfig = {
  listUrl: 'auth/users',
  deleteUrl: 'auth/users/{id}',
  enableDelete: true,
  enableBatchDelete: true,
  defaultPageSize: 20,
  deleteConfirmMessage: 'Are you sure you want to delete this user?',
  batchDeleteConfirmMessage: 'Are you sure you want to delete selected users?',
}

// 使用表格数据管理 composable
const {
  loading,
  tableData,
  pagination: paginationData,
  handlePageChange,
  fetchTableData,
  deleteRow,
} = useTableData<UserManagementInfo>(tableConfig)

// 创建可写的分页数�?
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0,
})

// 同步分页数据
watch(
  paginationData,
  (newPagination) => {
    pagination.page = newPagination.page
    pagination.pageSize = newPagination.pageSize
    pagination.total = newPagination.total
  },
  { immediate: true },
)

// 表单引用
const userFormRef = ref()

// 添加用户
const handleAddUser = () => {
  userFormRef.value?.open()
}

// 处理用户表单提交
const handleUserSubmit = async (formData: any) => {
  await fetchTableData(true)
}

// 编辑用户
const handleEdit = (row: UserManagementInfo) => {
  userFormRef.value?.open(row.id, 'edit')
}

// 删除用户
const handleDelete = async (row: UserManagementInfo) => {
  await ElMessageBox.confirm(
    'Are you sure you want to delete this record?',
    'Delete Confirmation',
    {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning',
    },
  )

  await deleteRow(row.id)
}
/**
 * 获取用户名头像缩写：名和姓的首字母（如"张三"->"张三"，"John Smith"->"JS"，"王"->"王"）
 * @param name 用户名字符串
 * @returns string 头像缩写
 */
const getAvatarName = (name: string): string => {
  if (!name) return ''
  // 英文名处理
  if (/^[a-zA-Z\s]+$/.test(name)) {
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) {
      return parts[0][0].toUpperCase()
    } else {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
  }
  // 中文名处理
  // 假设中文名一般为2-3字，姓在前
  if (name.length === 2) {
    return name
  } else if (name.length >= 3) {
    return name[0] + name[1]
  } else {
    return name[0]
  }
}
</script>

<style scoped lang="scss">
.voltage-class .user-management {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .user-management__header {
    display: flex;
    align-items: center;
    margin-bottom: 0.2rem;

    .user-management__add-btn {
      display: flex;
      align-items: center;
      gap: 0.08rem;

      .user-management__add-btn-icon {
        width: 0.14rem;
        height: 0.14rem;
        margin-right: 0.08rem;
      }
    }
  }

  .user-management__table {
    height: calc(100% - 0.52rem);

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.1rem;
      height: 0.4rem;

      .user-avatar {
        width: 0.4rem;
        height: 0.4rem;
        border-radius: 50%;
        background-color: rgba(29, 134, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.19rem;
        letter-spacing: 0%;
        color: rgba(29, 134, 255, 1);
      }

      .user-name {
        font-size: 0.16rem;
        letter-spacing: 0%;
        color: rgba(255, 255, 255, 1);
      }
    }

    .user-management__table-content {
      width: 100%;
      height: calc(100% - 0.92rem);
      overflow-y: auto;

      .user-management__operation {
        display: flex;
        align-items: center;
        gap: 0.2rem;

        .user-management__operation-item {
          cursor: pointer;
          display: flex;
          align-items: center;

          img {
            width: 0.14rem;
            height: 0.14rem;
            margin-right: 0.04rem;
            object-fit: contain;
          }
        }
      }
    }

    .user-management__pagination {
      display: flex;
      justify-content: flex-end;
      margin: 0.2rem 0;
    }
  }
}

:deep(.el-form.el-form--inline .el-form-item) {
  margin-bottom: 0.4rem !important;
}

:deep(.el-table .el-table__inner-wrapper .el-table__body-wrapper td .cell) {
  height: 0.4rem !important;
}
</style>
