<script lang="ts" generic="T extends Record<string, any>" setup>
import type { TableColumnType, TableProps } from 'ant-design-vue'
import type { ColumnFilterItem, Key, SorterResult } from 'ant-design-vue/es/table/interface'

type IColumn<U> = TableColumnType<U> & { dataIndex?: keyof U }

defineOptions({
  name: 'BaseTable'
})
defineSlots<{
  default(props: { column: IColumn<T>; record: T; index: number; text: any }): any
  headerCell(props: { column: IColumn<T>; title: any }): any
  emptyText(): any
  customFilterDropdown(props: {
    prefixCls: string
    setSelectedKeys: (selectedKeys: Key[]) => void
    selectedKeys: Key[]
    confirm: (param?: { closeDropdown: boolean }) => void
    clearFilters?: (param?: { confirm?: boolean; closeDropdown?: boolean }) => void
    filters?: ColumnFilterItem[]
    visible: boolean
    column: IColumn<T>
  }): any
  customFilterIcon(props: { filtered: any; column: IColumn<T> }): any
  summary(): any
}>()

const $emits = defineEmits<{
  handleSort: [fieldName: keyof T, order?: 'descend' | 'ascend' | null]
  handleEdit: [id: Key, record: T]
  handleDelete: [id: Key, record: T]
  handleSelect: [ids: Key[]]
}>()
const $props = withDefaults(
  defineProps<{
    rowKey?: string
    columns: TableColumnType<T>[]
    list?: T[]
    loading?: boolean
    scroll?: { scrollToFirstRowOnChange?: boolean; x?: string | number | true; y?: string | number }
    defaultExpandAllRows?: boolean
    defaultExpandFirstRows?: boolean
    defaultExpandedRowKeys?: string[]
    /**
     * 展示默认操作项（删除/编辑按钮）
     */
    defaultShowOperation?: boolean
    /**
     * 展示默认选择配置
     */
    defaultRowSelection?: boolean
    rowSelection?: TableProps['rowSelection']
  }>(),
  {
    rowKey: 'id',
    scroll: () => ({
      scrollToFirstRowOnChange: true,
      y: 'calc(100vh - 234px - var(--st-scrollbar-h) - var(--st-header-h))'
    }),
    defaultExpandFirstRows: false,
    defaultShowOperation: true,
    defaultRowSelection: false
  }
)

const columnList = computed(() => {
  const defaultItem = {
    align: 'center',
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 160
  }

  const list = $props.defaultShowOperation ? [...$props.columns, defaultItem] : $props.columns
  return list as TableColumnType<T>[]
})

const selectedRowKeys = ref<Key[]>([])
const rowSelectionConfig = computed(() => {
  const defaultConfig: TableProps['rowSelection'] = {
    selectedRowKeys: selectedRowKeys.value,
    onChange: (keys: Key[]) => {
      selectedRowKeys.value = keys
      $emits('handleSelect', keys)
    }
  }

  return $props.defaultRowSelection
    ? { ...defaultConfig, ...$props.rowSelection }
    : $props.rowSelection
})

const expandedRowKeys = ref<string[]>([])
watch([() => $props.list, () => $props.defaultExpandedRowKeys], ([list, keys]) => {
  if (!list?.length) {
    return
  }

  const rowKey = $props.rowKey
  if (keys?.length) {
    expandedRowKeys.value = list.filter((v) => keys?.includes(v[rowKey])).map((v) => v[rowKey])
    return
  }
  if ($props.defaultExpandAllRows) {
    expandedRowKeys.value = list.map((item) => item[rowKey])
    return
  }
  if ($props.defaultExpandFirstRows) {
    expandedRowKeys.value = [list[0][rowKey]]
    return
  }
})

const handleSort = (_p: any, _f: any, sorter: SorterResult | SorterResult[]) => {
  const { field, order } = sorter as SorterResult
  const fieldName = field as keyof T

  $emits('handleSort', fieldName, order)
}

const handleEdit = (id: Key, record: T) => {
  $emits('handleEdit', id, record)
}
const handleDelete = (id: Key, record: T) => {
  $emits('handleDelete', id, record)
}
</script>

<template>
  <div class="base_table">
    <a-table
      v-bind="$attrs"
      class="ant-table-striped"
      :row-key="rowKey"
      :columns="columnList"
      :data-source="list"
      v-model:expanded-row-keys="expandedRowKeys"
      :loading="loading"
      :pagination="false"
      :scroll="scroll"
      :row-selection="rowSelectionConfig"
      :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : '')"
      @change="handleSort"
    >
      <template #bodyCell="{ column, record, index, text }">
        <slot :column="column as IColumn<T>" :record="record as T" :index="index" :text="text" />

        <template v-if="column.key === 'operation' && defaultShowOperation">
          <a-space>
            <a-button
              type="primary"
              size="small"
              ghost
              @click="handleEdit(record[rowKey], record as T)"
              >编辑</a-button
            >
            <ButtonDelete @handle-ok="handleDelete(record[rowKey], record as T)" />
          </a-space>
        </template>
      </template>

      <template #headerCell="{ column, title }">
        <slot name="headerCell" :column="column as IColumn<T>" :title="title" />
      </template>

      <template #emptyText>
        <slot name="emptyText" />
      </template>
      <template
        #customFilterDropdown="{
          prefixCls,
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
          filters,
          visible,
          column
        }"
      >
        <slot
          name="customFilterDropdown"
          :prefixCls="prefixCls"
          :setSelectedKeys="setSelectedKeys"
          :selectedKeys="selectedKeys"
          :confirm="confirm"
          :clearFilters="clearFilters"
          :filters="filters"
          :visible="visible"
          :column="column"
        />
      </template>
      <template #customFilterIcon="{ filtered, column }">
        <slot name="customFilterIcon" :filtered="filtered" :column="column" />
      </template>
      <template #summary>
        <slot name="summary" />
      </template>
    </a-table>
  </div>
</template>

<style lang="scss" scoped>
.base_table {
  margin: 20px auto;
}

.ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}
.dark .ant-table-striped :deep(.table-striped) td {
  background-color: rgb(29, 29, 29);
}
</style>