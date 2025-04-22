<!-- 用户上传数据界面 -->
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
// 模拟已上传的数据
const uploadedItems = ref([
    { id: 1, name: '前端开发技巧分享', submitTime: '2023-10-15 14:30', status: '已发布' },
    { id: 2, name: 'Vue3 组件设计模式', submitTime: '2023-10-20 09:45', status: '审核中' },
    { id: 3, name: 'TypeScript 实战指南', submitTime: '2023-10-22 16:20', status: '已发布' },
    { id: 4, name: '响应式布局最佳实践', submitTime: '2023-10-25 11:10', status: '审核中' }
]);

// 获取状态对应的标签类型
const getStatusType = (status) => {
    return status === '已发布' ? 'success' : status === '审核中' ? 'warning' : 'info';
};

// 跳转到上传主界面
const jump2UploadMainData = () => {
    router.push({
        path: '/user/center/upload/data'
    });
};
</script>

<template>
    <div>
        <div class="user-center-upload-new"><el-button type="primary" @click="jump2UploadMainData">提交新数据</el-button></div>
        <div class="user-center-upload-details">
            <h3>已上传内容</h3>
            <el-table :data="uploadedItems" style="width: 100%" stripe>
                <el-table-column prop="name" label="名称" min-width="180" />
                <el-table-column prop="submitTime" label="提交时间" min-width="150" />
                <el-table-column label="状态" min-width="100">
                    <template #default="scope">
                        <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template #default="scope">
                        <el-button size="small" type="primary" plain>查看</el-button>
                        <el-button size="small" type="danger" plain>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="empty-placeholder" v-if="uploadedItems.length === 0">
                暂无上传内容
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.user-center-upload-new {
    // padding: 0 16px;
}
.user-center-upload-details {
    width: calc(100%  );
    margin: 20px auto;
    padding: 16px 0;
    background-color: #fff;
    border-radius: 8px;
    // box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);


    h3 {
        margin-top: 0;
        margin-bottom: 16px;
        font-size: 18px;
        color: #303133;
        width: 100%;
    }

    .empty-placeholder {
        padding: 30px 0;
        text-align: center;
        color: #909399;
        font-size: 14px;
        width: 100%;
    }
}
</style>