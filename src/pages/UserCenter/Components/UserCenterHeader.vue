<!-- UserCenter 的最上面的栏目 -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {  Calendar, Link } from '@element-plus/icons-vue';

const defaultAvatar = '/public/images/default-avatar.png'
const isCurrentUser = ref(true)
const userInfo = ref<any>({
    avatar: '',
    username: '',
    userDescription: '',
    createTime: '',
    userBlog: ''
});

const userTags = ref([
    { content: '前端开发', color: '#e1f3d8' },
    { content: 'Vue爱好者', color: '#fdf6ec' }
]);

const handleChangeAvatar = () => {
    console.log('change avatar')
}

const formatJoinDate = (date: string) => {
    if (!date) return '未知时间';
    return new Date(date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}

const formatUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://${url}`;
}
</script>

<template>
    <div class="user-header-content">
        <div class="user-avatar-container">
            <el-avatar :size="80" :src="userInfo.avatar || defaultAvatar" class="user-avatar-detail"/>
            <div class="edit-avatar" v-if="isCurrentUser" @click="handleChangeAvatar">
                <!-- <el-icon>
                    <EditPen />
                </el-icon> -->
                <el-button size="small">上传头像</el-button>
            </div>
        </div>
        <div class="user-info-container">
            <h1 class="user-name">{{ userInfo.username || '未设置昵称' }}</h1>
            <div class="user-id">@{{ userInfo.username || 'username' }}</div>
            <div class="user-bio">{{ userInfo.userDescription || '这个人很懒，什么都没有留下...' }}</div>
            <div class="user-meta">
                <div class="meta-item">
                    <el-icon>
                        <Calendar />
                    </el-icon>
                    <span>加入于 {{ formatJoinDate(userInfo.createTime) }}</span>
                </div>
                <div class="meta-item" v-if="userInfo.userBlog">
                    <el-icon>
                        <Link />
                    </el-icon>
                    <a :href="formatUrl(userInfo.userBlog)" target="_blank" rel="noopener noreferrer">
                        {{ userInfo.userBlog }}
                    </a>
                </div>
            </div>
            <div class="user-tags" v-if="userTags && userTags.length > 0">
                <el-tag v-for="tag in userTags" :key="tag.content" :color="tag.color" effect="plain" class="user-tag">
                    {{ tag.content }}
                </el-tag>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.user-header-content {
    display: flex;
    padding: 24px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.user-avatar-container {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-right: 24px;
    gap: 10px;
    .user-avatar-detail {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 80px;
        height: 80px;
        border: 2px solid #fff;
        // box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    } // 头像边框和阴影样式与头像相同，保持一致，避免出现不一致的情况

    .edit-avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s;

        // &:hover {
        //     background-color: #e6e6e6;
        // }
    }
}

.user-info-container {
    flex: 1;

    .user-name {
        font-size: 24px;
        font-weight: 600;
        margin: 0 0 4px 0;
    }

    .user-id {
        font-size: 14px;
        color: #909399;
        margin-bottom: 12px;
    }

    .user-bio {
        font-size: 16px;
        color: #606266;
        margin-bottom: 16px;
        line-height: 1.5;
    }

    .user-meta {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 16px;

        .meta-item {
            display: flex;
            align-items: center;
            margin-right: 16px;
            margin-bottom: 8px;
            font-size: 14px;
            color: #606266;

            .el-icon {
                margin-right: 4px;
                font-size: 16px;
            }

            a {
                color: #409eff;
                text-decoration: none;

                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }

    .user-tags {
        display: flex;
        flex-wrap: wrap;

        .user-tag {
            margin-right: 8px;
            margin-bottom: 8px;
        }
    }
}

@media (max-width: 768px) {
    .user-header-content {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .user-avatar-container {
        margin-right: 0;
        margin-bottom: 16px;
    }

    .user-meta {
        justify-content: center;
    }
}
</style>
