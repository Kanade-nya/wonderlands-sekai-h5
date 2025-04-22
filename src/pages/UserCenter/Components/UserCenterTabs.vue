<!-- 用户中心的切换Tabs -->
 <script setup>
 import { ref } from 'vue';
 import UserCenterUploadVue from './Tabs/UserCenterUpload.vue';
 // 定义当前激活的标签页
const activeTab = ref('activities');
// 用户ID，实际使用时可能需要从路由或props获取
const userId = ref('');
 </script>
 <template>
 <el-tabs v-model="activeTab" class="user-tabs">
        <el-tab-pane label="动态" name="activities">
            <user-activities :user-id="userId" />
        </el-tab-pane>
        <el-tab-pane label="文章" name="articles">
            <user-articles :user-id="userId" />
        </el-tab-pane>
        <el-tab-pane label="收藏" name="collections">
            <user-collections :user-id="userId" />
        </el-tab-pane>
        <el-tab-pane label="关注" name="following">
            <user-following :user-id="userId" />
        </el-tab-pane>
        <el-tab-pane label="粉丝" name="followers">
            <user-followers :user-id="userId" />
        </el-tab-pane>
        <el-tab-pane label="提交" name="upload">
            <UserCenterUploadVue />
        </el-tab-pane>
    </el-tabs>
 </template>
 <style lang="scss" scoped></style>