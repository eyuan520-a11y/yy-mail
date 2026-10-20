<template>
  <div class="group-box">
    <div class="header-actions">
      <Icon class="icon" icon="ion:add-outline" width="23" height="23" @click="openAdd"/>
      <div class="search">
        <el-input
            v-model="params.name"
            class="search-input"
            :placeholder="$t('groupName')"
            @keyup.enter="search"
        />
      </div>
      <Icon class="icon" icon="iconoir:search" @click="search" width="20" height="20"/>
      <Icon class="icon" icon="ion:reload" width="18" height="18" @click="refresh"/>
    </div>
    <el-scrollbar ref="scrollbarRef" class="scrollbar">
      <el-table
          :data="groups"
          style="width: 100%"
          v-loading="loading"
          element-loading-background="transparent"
          :empty-text="loading ? '' : null"
      >
        <el-table-column :label="$t('groupName')" min-width="220">
          <template #default="props">
            <div class="group-name">
              <span class="color-dot" :style="{ background: props.row.color || '#dcdfe6' }"/>
              <span :style="{ color: props.row.color || 'inherit' }">{{ props.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('tabSetting')" :width="160">
          <template #default="props">
            <el-button size="small" type="primary" @click="openEdit(props.row)">{{ $t('edit') }}</el-button>
            <el-button size="small" type="danger" @click="delGroup(props.row)">{{ $t('delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>

    <el-dialog v-model="showDialog" :title="dialogTitle" @closed="resetForm">
      <div class="dialog-box">
        <el-input v-model="form.name" :placeholder="$t('groupName')" @keyup.enter="submit"/>
        <div class="color-row">
          <span class="color-label">{{ $t('groupColor') }}</span>
          <el-color-picker v-model="form.color" color-format="rgb" :predefine="predefineColors"/>
        </div>
        <el-button class="btn" type="primary" :loading="saving" @click="submit">{{ $t('save') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import {defineOptions, reactive, ref} from 'vue'
import {Icon} from "@iconify/vue";
import {groupList, groupAdd, groupUpdate, groupDelete} from "@/request/group.js";
import {useI18n} from 'vue-i18n';

defineOptions({
  name: 'group'
})

const {t} = useI18n();
const groups = ref([])
const loading = ref(true)
const scrollbarRef = ref(null)
const showDialog = ref(false)
const saving = ref(false)
const dialogTitle = ref('')
const form = reactive({groupId: 0, name: '', color: null})
const params = reactive({name: ''})

const predefineColors = [
  'rgb(245, 108, 108)',
  'rgb(230, 162, 60)',
  'rgb(255, 193, 7)',
  'rgb(103, 194, 58)',
  'rgb(64, 158, 255)',
  'rgb(144, 129, 255)',
  'rgb(245, 108, 179)',
  'rgb(129, 212, 250)',
]

function loadList() {
  loading.value = true
  const p = {}
  if (params.name) p.name = params.name
  groupList(p).then(list => {
    groups.value = list || []
  }).finally(() => {
    loading.value = false
  })
}

loadList()

function search() {
  loadList()
}

function refresh() {
  params.name = ''
  loadList()
}

function openAdd() {
  dialogTitle.value = t('addGroup')
  showDialog.value = true
}

function openEdit(row) {
  form.groupId = row.groupId
  form.name = row.name
  form.color = row.color || null
  dialogTitle.value = t('editGroup')
  showDialog.value = true
}

function resetForm() {
  form.groupId = 0
  form.name = ''
  form.color = null
}

function submit() {
  if (saving.value) return
  if (!form.name) {
    ElMessage({
      message: t('emptyGroupName'),
      type: "error",
      plain: true
    })
    return
  }
  saving.value = true
  const data = {name: form.name, color: form.color || ''}
  const req = form.groupId
    ? groupUpdate({...data, groupId: form.groupId})
    : groupAdd(data)
  req.then(() => {
    ElMessage({
      message: t('saveSuccessMsg'),
      type: "success",
      plain: true
    })
    showDialog.value = false
    loadList()
  }).finally(() => {
    saving.value = false
  })
}

function delGroup(row) {
  ElMessageBox.confirm(t('delConfirm', {msg: row.name}), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    type: 'warning'
  }).then(() => {
    groupDelete({groupIds: row.groupId}).then(() => {
      ElMessage({
        message: t('delSuccessMsg'),
        type: "success",
        plain: true
      })
      loadList()
    })
  });
}
</script>

<style scoped lang="scss">
.group-box {
  overflow: hidden;
  height: 100%;
}

.header-actions {
  padding: 9px 15px;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: center;
  box-shadow: var(--header-actions-border);
  font-size: 18px;

  .search-input {
    width: min(220px, calc(100vw - 140px));
  }

  .icon {
    cursor: pointer;
  }
}

.scrollbar {
  width: 100%;
  overflow: auto;
  height: calc(100% - 50px);
}

.group-name {
  display: flex;
  align-items: center;
  gap: 8px;

  .color-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
  }
}

.dialog-box {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;

  .color-row {
    display: flex;
    align-items: center;
    gap: 12px;

    .color-label {
      color: var(--el-text-color-regular);
      white-space: nowrap;
    }
  }

  .btn {
    width: 100%;
  }
}
</style>
