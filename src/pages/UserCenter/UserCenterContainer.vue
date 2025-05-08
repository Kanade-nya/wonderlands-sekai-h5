<script setup>

import UserCenterHeaderVue from './Components/UserCenterHeader.vue';
import UserCenterTabsVue from './Components/UserCenterTabs.vue';

</script>

<template>

 <div class="user-panel-content">
    <UserCenterHeaderVue></UserCenterHeaderVue>
    <UserCenterTabsVue></UserCenterTabsVue>
 </div>
</template>

<style lang="scss" scoped>
.user-panel-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  // box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  min-height: calc(100vh - 58px - 40px - 48px);
}

.user-tabs {
  margin-top: 20px;
  
  :deep(.el-tabs__header) {
    margin-bottom: 20px;
  }
  
  :deep(.el-tabs__item) {
    font-size: 16px;
    padding: 0 20px;
    height: 50px;
    line-height: 50px;
    
    &.is-active {
      font-weight: bold;
      color: #409eff;
    }
    
    &:hover {
      color: #79bbff;
    }
  }
  
  :deep(.el-tabs__content) {
    padding: 20px 0;
  }
}
</style>