<script lang="ts" setup>
import RoleModal from './RoleModal.vue'

import { message } from 'ant-design-vue'
import { getRoleDetail, updateRole } from '@/api/role'
import { getChangedData } from '@/utils'

import type { IRoleDetail, IRoleEditParam } from '@/types/api/role'

const $props = defineProps<{
  id: number
}>()
const $emits = defineEmits<{
  handleSuccess: []
}>()

const open = ref(false)
const loading = ref(false)
const detail = ref<IRoleDetail>()

const handleOpen = async () => {
  open.value = true
  loading.value = true
  const [, result] = await getRoleDetail($props.id)
  loading.value = false
  if (!result) {
    return
  }

  detail.value = result.data
}

const handleEdit = async (data: IRoleEditParam) => {
  data = getChangedData(data, detail.value!)
  if (Object.keys(data).length === 0) {
    message.warn('您没有修改任何信息！')
    return
  }

  loading.value = true
  const [, result] = await updateRole($props.id, data)
  loading.value = false
  if (result) {
    open.value = false
    $emits('handleSuccess')
    message.success('修改角色成功')
  }
}
</script>

<template>
  <a-button type="primary" size="small" ghost @click="handleOpen">编辑</a-button>
  <role-modal
    v-model="open"
    v-model:loading="loading"
    title="编辑角色"
    :details="detail"
    @on-ok="handleEdit"
  />
</template>

<style lang="scss" scoped></style>
