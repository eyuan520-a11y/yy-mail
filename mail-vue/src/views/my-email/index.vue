<template>
  <div class="email-list-box">
    <emailScroll ref="sysEmailScroll"
                 :get-emailList="getEmailList"
                 :time-sort="params.timeSort"
                 :star-add="starAdd"
                 :star-cancel="starCancel"
                 :star-success="addStar"
                 :cancel-success="cancelStar"
                 :show-star="true"
                 show-user-info
                 show-group
                 actionLeft="4px"
                 :show-account-icon="false"
                 :type="'my-email'"
                 @jump="jumpContent"
                 @refresh-before="refreshBefore"
                 @right-search="rightSearch"
    >
      <template #first>
        <el-input
            v-model="searchValue"
            :placeholder="$t('searchByContent')"
            class="search-input"
        >
          <template #prefix>
            <div @click.stop="openSelect">
              <el-select
                  ref="mySelect"
                  v-model="params.searchType"
                  :placeholder="$t('select')"
                  class="select"
              >
                <el-option key="3" :label="$t('sender')" :value="'name'"/>
                <el-option key="4" :label="$t('subject')" :value="'subject'"/>
                <el-option key="1" :label="$t('user')" :value="'user'"/>
                <el-option key="2" :label="$t('selectEmail')" :value="'account'"/>
                <el-option key="5" :label="$t('content')" :value="'content'"/>
              </el-select>
              <div class="search-type">
                <span>{{ selectTitle }}</span>
                <Icon class="setting-icon" icon="mingcute:down-small-fill" width="20" height="20"/>
              </div>
            </div>
          </template>
        </el-input>
        <el-select v-model="params.type" placeholder="Select" class="status-select" @change="typeSelectChange">
          <el-option key="1" :label="$t('all')" value="all"/>
          <el-option key="3" :label="$t('received')" value="receive"/>
          <el-option key="2" :label="$t('sent')" value="send"/>
          <el-option key="4" :label="$t('selectDeleted')" value="delete"/>
          <el-option key="4" :label="$t('noRecipientTitle')" value="noone"/>
        </el-select>
        <el-select v-model="params.groupId" :placeholder="$t('groupName')" class="group-select" clearable @change="search">
          <el-option :key="0" :label="$t('allGroups')" :value="null"/>
          <el-option v-for="g in groups" :key="g.groupId" :label="g.name" :value="g.groupId">
            <span class="group-opt">
              <span class="color-dot" :style="{ background: g.color || '#dcdfe6' }"></span>
              <span :style="{ color: g.color || 'inherit' }">{{ g.name }}</span>
            </span>
          </el-option>
        </el-select>
        <Icon class="icon" icon="iconoir:search" @click="search" width="20" height="20"/>
        <Icon class="icon" @click="changeTimeSort" icon="material-symbols-light:timer-arrow-down-outline"
              v-if="params.timeSort === 0" width="28" height="28"/>
        <Icon class="icon" @click="changeTimeSort" icon="material-symbols-light:timer-arrow-up-outline" v-else
              width="28" height="28"/>
      </template>
    </emailScroll>
  </div>
</template>

<script setup>
import emailScroll from "@/components/email-scroll/index.vue"
import {computed, defineOptions, reactive, ref} from "vue";
import {useEmailStore} from "@/store/email.js";
import {
  myEmailList
} from "@/request/all-email.js";
import {starAdd, starCancel} from "@/request/star.js";
import {groupList} from "@/request/group.js";
import {Icon} from "@iconify/vue";
import router from "@/router/index.js";
import {useI18n} from 'vue-i18n';

defineOptions({
  name: 'my-email'
})

const {t} = useI18n();
const emailStore = useEmailStore();
const sysEmailScroll = ref({})
const searchValue = ref('')
const mySelect = ref()

const params = reactive({
  timeSort: 0,
  type: 'receive',
  userEmail: null,
  accountEmail: null,
  name: null,
  subject: null,
  content: null,
  groupId: null,
  searchType: 'name'
})

const groups = ref([])

function loadGroups() {
  groupList({}).then(list => {
    groups.value = list || []
  }).catch(() => {
    groups.value = []
  })
}

loadGroups()

function openSelect() {
  mySelect.value.toggleMenu()
}

const selectTitle = computed(() => {
  if (params.searchType === 'user') return t('user')
  if (params.searchType === 'account') return t('selectEmail')
  if (params.searchType === 'name') return t('sender')
  if (params.searchType === 'subject') return t('subject')
  if (params.searchType === 'content') return t('content')
})

function rightSearch(type, value) {
  params.searchType = type;
  searchValue.value = value;
  search();
}

function refreshBefore() {
  searchValue.value = null
  params.timeSort = 0
  params.type = 'receive'
  params.userEmail = null
  params.accountEmail = null
  params.name = null
  params.subject = null
  params.content = null
  params.groupId = null
  params.searchType = 'name'
}

function search() {

  params.userEmail = null
  params.accountEmail = null
  params.name = null
  params.subject = null
  params.content = null

  if (params.searchType === 'user') {
    params.userEmail = searchValue.value
  }

  if (params.searchType === 'account') {
    params.accountEmail = searchValue.value
  }

  if (params.searchType === 'name') {
    params.name = searchValue.value
  }

  if (params.searchType === 'subject') {
    params.subject = searchValue.value
  }

  if (params.searchType === 'content') {
    params.content = searchValue.value
  }

  sysEmailScroll.value.refreshList();
}

function changeTimeSort() {
  params.timeSort = params.timeSort ? 0 : 1
  search()
}

function typeSelectChange() {
  search()
}

function jumpContent(email) {
  emailStore.contentData.email = emailStore.toContentEmail(email)
  emailStore.contentData.delType = 'physics'
  emailStore.contentData.showStar = false
  emailStore.contentData.showReply = false
  router.push({name: 'content'})
}

function getEmailList(emailId, size) {
  return emailStore.fetchList(full => myEmailList({emailId, size, full, ...params}))
}

function addStar(email) {
  emailStore.starScroll?.addItem(email)
}

function cancelStar(email) {
  emailStore.starScroll?.deleteEmail([email.emailId])
}

</script>
<style scoped lang="scss">
.email-list-box {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.search {
  padding-top: 5px;
  padding-bottom: 5px;
}

.select {
  position: absolute;
  width: 40px;
  opacity: 0;
  pointer-events: none;
}

.search-type {
  display: flex;
  color: var(--el-text-color-regular);
}

:deep(.header-actions) {
  padding-top: 8px;
  padding-bottom: 8px;
}

.search-input {
  width: 100%;
  max-width: 280px;
  height: 28px;

  .setting-icon {
    position: relative;
    top: 3px;
  }
}

.status-select {
  margin-bottom: 2px;
  width: 102px;

  :deep(.el-select__wrapper) {
    min-height: 28px;
  }
}

.group-select {
  margin-bottom: 2px;
  width: 140px;

  :deep(.el-select__wrapper) {
    min-height: 28px;
  }
}

.color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  display: inline-block;
}

.group-opt {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-with-select {
  max-width: 200px;
  border-radius: 0 4px 4px 0;
}

:deep(.el-select__wrapper) {
  padding: 2px 10px;
  min-height: 28px;
}

.icon {
  cursor: pointer;
}
</style>
