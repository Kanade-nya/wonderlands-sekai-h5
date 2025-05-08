<!-- 用户中心的切换Tabs -->
<script setup>
import { ref, onMounted, shallowRef } from 'vue';
// 使用shallowRef优化性能，因为我们引用的是组件对象
import UserCenterUploadVue from './Tabs/UserCenterUpload.vue';
import AdminVue from './Tabs/Admin.vue';
import UserCenterInfoVue from './Tabs/UserCenterInfo.vue';
import UserCenterMetaVue from './Tabs/UserCenterMeta.vue';
import UserCenterHistoryArticlesVue from './Tabs/UserCenterHistoryArticles.vue';
// 调用userData数据
import { useUserData } from "@/stores/useUserData.js";
import { localUrl } from "@/utils/methods.js";
import axios from 'axios';
const userData = useUserData();
// 定义当前激活的标签页
const activeTab = ref('info');
// 用户ID，实际使用时可能需要从路由或props获取
const userId = ref('');

const isAdmin = ref(false);
onMounted(() => {
    const checkAdminStatus = async () => {
        try {
            const response = await fetch(
                `${localUrl}/user-center/check-admin`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                }
            );
            const data = await response.json();
            console.log(data.isAdmin);
            
            isAdmin.value = data.is_admin;
            console.log('value: ' , isAdmin.value);
            
        } catch (error) {
            console.error('Error checking admin status:', error);
        }
    }
    checkAdminStatus();
})
</script>

<template>
    <el-tabs v-model="activeTab" class="user-tabs">
        <el-tab-pane label="资料" name="info">
            <UserCenterInfoVue v-if="activeTab === 'info'" />
        </el-tab-pane>
        <el-tab-pane label="标签" name="meta">
            <UserCenterMetaVue v-if="activeTab === 'meta'" />
        </el-tab-pane>
        <el-tab-pane label="文章" name="articles">
            <UserCenterHistoryArticlesVue v-if="activeTab === 'articles'" />
        </el-tab-pane>
        <!-- <el-tab-pane label="收藏" name="collections">
            <user-collections :user-id="userId" />
        </el-tab-pane>
        <el-tab-pane label="关注" name="following">
            <user-following :user-id="userId" />
        </el-tab-pane>
        <el-tab-pane label="粉丝" name="followers">
            <user-followers :user-id="userId" />
        </el-tab-pane> -->
        <el-tab-pane label="提交" name="upload">
            <UserCenterUploadVue v-if="activeTab === 'upload'" />
        </el-tab-pane>
        <el-tab-pane label="数据" name="admin" v-if="isAdmin">
            <AdminVue v-if="activeTab === 'admin'" />
        </el-tab-pane>
    </el-tabs>
</template>
<style lang="scss" scoped></style>