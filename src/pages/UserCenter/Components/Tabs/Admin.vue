<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import axios from 'axios';
import { localUrl } from "@/utils/methods.js";

const pendingList = ref([]);

// 获取待审核数据
const getPendingData = async () => {
    try {
        const response = await axios.get(
            `${localUrl}/admin/pending-images`,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            }
        );
        if (response.status === 200) {
            pendingList.value = response.data;
        }
    } catch (error) {
        ElMessage.error('获取数据失败');
    }
};

// 处理审核
const handleReview = async (id, status) => {
    try {
        const response = await axios.post(
            `${localUrl}/admin/review-image/${id}`,
            {
                id: id,
                status: status,
                token: localStorage.getItem('access_token'),
                comment: '无'
            },
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            }
        );
        if (response.status === 200) {
            ElMessage.success('操作成功');
            getPendingData(); // 刷新数据
        }
    } catch (error) {
        ElMessage.error('操作失败');
    }
};

onMounted(() => {
    getPendingData();
});
</script>

<template>
    <div class="admin-container">
        <h2>待审核数据</h2>
        <div class="pending-list">
            <el-card v-for="item in pendingList" :key="item.id" class="pending-item">
                <div class="item-header">
                    <h3>{{ item.title }}</h3>
                    <span class="artist">画师：{{ item.artiest }}</span>
                </div>

                <div class="image-preview">
                    <el-image 
                        v-for="(url, index) in item.image_url" 
                        :key="index"
                        :src="url"
                        :preview-src-list="item.image_url"
                        fit="cover"
                    />
                </div>

                <div class="item-info">
                    <p class="description">{{ item.description }}</p>
                    <div class="tags">
                        <el-tag>类型: {{ item.type_id }}</el-tag>
                        <el-tag type="success">角色: {{ item.character_id }}</el-tag>
                    </div>
                </div>

                <div class="action-buttons">
                    <el-button type="success" @click="handleReview(item.id, 1)">通过</el-button>
                    <el-button type="danger" @click="handleReview(item.id, 2)">拒绝</el-button>
                </div>
            </el-card>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.admin-container {
    padding: 20px;

    h2 {
        margin-bottom: 20px;
        color: #333;
    }

    .pending-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;

        .pending-item {
            .item-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;

                h3 {
                    margin: 0;
                    font-size: 18px;
                }

                .artist {
                    color: #666;
                    font-size: 14px;
                }
            }

            .image-preview {
                display: flex;
                gap: 10px;
                margin-bottom: 15px;
                overflow-x: auto;

                .el-image {
                    width: 100px;
                    height: 100px;
                    border-radius: 4px;
                    cursor: pointer;
                }
            }

            .item-info {
                margin-bottom: 15px;

                .description {
                    margin: 10px 0;
                    color: #666;
                }

                .tags {
                    display: flex;
                    gap: 10px;
                }
            }

            .action-buttons {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }
        }
    }
}
</style>