<template>
    <div class="user-panel-container">
        <div class="user-panel-header">
            <div class="user-header-content">
                <div class="user-avatar-container">
                    <el-avatar :size="80" :src="userInfo.avatar || defaultAvatar" />
                    <div class="edit-avatar" v-if="isCurrentUser" @click="handleChangeAvatar">
                        <el-icon>
                            <EditPen />
                        </el-icon>
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
                            <a :href="formatUrl(userInfo.userBlog)" target="_blank" rel="noopener noreferrer">{{
                userInfo.userBlog }}</a>
                        </div>
                    </div>
                    <div class="user-tags" v-if="userTags && userTags.length > 0">
                        <el-tag v-for="tag in userTags" :key="tag.content" :color="tag.color" effect="plain"
                            class="user-tag">
                            {{ tag.content }}
                        </el-tag>
                    </div>
                </div>
                <div class="user-actions">
                    <el-button v-if="isCurrentUser" type="primary" @click="goToEditProfile">编辑资料</el-button>
                    <el-button v-else type="primary" @click="followUser" :loading="followLoading">
                        {{ isFollowing ? '已关注' : '关注' }}
                    </el-button>
                    <el-button v-if="!isCurrentUser" @click="sendMessage" >发送消息</el-button>
                </div>
            </div>
        </div>

        <div class="user-panel-content">
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
            </el-tabs>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Calendar, Link, EditPen } from '@element-plus/icons-vue';
import { useUserInfoStore } from '@/stores/useUserInfoStore';
import { localUrl } from '@/utils/methods';
import {userProfile} from "@/api/user";
import axios from 'axios';

// 导入子组件
import UserActivities from './components/UserActivities.vue';
import UserArticles from './components/UserArticles.vue';
import UserCollections from './components/UserCollections.vue';
import UserFollowing from './components/UserFollowing.vue';
import UserFollowers from './components/UserFollowers.vue';

const route = useRoute();
const router = useRouter();
const userInfoStore = useUserInfoStore();

// 默认图片
const defaultAvatar = '/public/images/default-avatar.png';
// 删除不需要的变量
// const defaultCoverImage = '/public/images/default-cover.jpg';

// 用户ID和标签页
const userId = ref(route.params.id || userInfoStore.getUserInfo.id);
const activeTab = ref('activities');

// 用户信息
const userInfo = ref({});
const userTags = ref([]);
// 删除不需要的变量
// const userCoverImage = ref('');
const isFollowing = ref(false);
const followLoading = ref(false);

// 判断是否是当前登录用户
const isCurrentUser = computed(() => {
    // console.log(useUserInfoStore.getUserInfo.id );
    return userInfoStore.getUserInfo.id === userId.value;
});

// 获取用户信息
const fetchUserInfo = async () => {
    console.log('开始页面');
    
    try {
        const response = await userProfile.getUserPublicData(userId.value);
       
        userInfo.value = response;

        // 获取用户标签
        fetchUserTags();

        // 获取是否已关注
        if (!isCurrentUser.value) {
            checkIfFollowing();
        }
        
    } catch (error) {
        console.error('获取用户信息失败:', error);
        ElMessage.error('获取用户信息失败');
    }
};

// 获取用户标签
const fetchUserTags = async () => {
    try {
        const response = await axios.get(`${localUrl}/user/get-user-meta/${userId.value}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });

        if (response.data && response.data.metas) {
            userTags.value = response.data.metas;
        }
    } catch (error) {
        console.error('获取用户标签失败:', error);
    }
};

// 检查是否已关注该用户
const checkIfFollowing = async () => {
    try {
        const response = await axios.get(`${localUrl}/user/check-following/${userId.value}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });

        if (response.status === 200) {
            isFollowing.value = response.data.following;
        }
    } catch (error) {
        console.error('检查关注状态失败:', error);
    }
};

// 关注/取消关注用户
const followUser = async () => {
    if (!userInfoStore.isLoggedIn) {
        ElMessage.warning('请先登录');
        router.push('/user/login');
        return;
    }

    followLoading.value = true;
    try {
        const url = isFollowing.value
            ? `${localUrl}/user/unfollow/${userId.value}`
            : `${localUrl}/user/follow/${userId.value}`;

        const response = await axios.post(url, {}, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });

        if (response.status === 200) {
            isFollowing.value = !isFollowing.value;
            ElMessage.success(isFollowing.value ? '关注成功' : '已取消关注');
        }
    } catch (error) {
        console.error('操作失败:', error);
        ElMessage.error('操作失败，请稍后重试');
    } finally {
        followLoading.value = false;
    }
};

// 发送消息
const sendMessage = () => {
    router.push(`/messages/new?recipient=${userId.value}`);
};

// 前往编辑资料页面
const goToEditProfile = () => {
    router.push('/user/profile');
};

// 更换头像
const handleChangeAvatar = () => {
    router.push('/user/profile');
};

// 删除封面图片并优化样式

// 我将帮您删除封面图片相关代码，并优化用户面板的样式，使其在没有封面图片的情况下看起来更加美观。

// 以下是对 UserPanelMain.vue 文件的修改：

// 更换封面
// const handleChangeCover = () => {
//     // 实现封面更换逻辑
//     ElMessage.info('封面更换功能开发中...');
// };

// 格式化加入日期
const formatJoinDate = (dateString) => {
    if (!dateString) return '未知时间';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
};

// 格式化URL
const formatUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://${url}`;
};

onMounted(() => {
    fetchUserInfo();
});
</script>

<style lang="scss" scoped>
.user-panel-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;

    .user-panel-header {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
        margin-bottom: 20px;
        overflow: hidden;
        padding-top: 20px; // 添加顶部内边距

        // 删除封面图片相关样式
        // .user-cover-image { ... }

        .user-header-content {
            padding: 20px 30px 30px;
            display: flex;
            position: relative;
            align-items: center; // 确保垂直居中对齐

            .user-avatar-container {
                position: relative;
                
                .el-avatar {
                    border: 3px solid #fff; // 减小边框
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }

                .edit-avatar {
                    position: absolute;
                    right: 2px;
                    bottom: 2px;
                    background-color: #409EFF;
                    color: white;
                    width: 20px; // 减小编辑按钮大小
                    height: 20px; // 减小编辑按钮大小
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 12px; // 减小图标大小

                    &:hover {
                        background-color: #66b1ff;
                    }
                }
            }

            .user-info-container {
                margin-left: 20px;
                flex: 1;

                .user-name {
                    font-size: 22px; // 减小字体大小
                    font-weight: 600;
                    margin: 0 0 5px;
                }

                .user-id {
                    color: #909399;
                    font-size: 14px;
                    margin-bottom: 8px;
                }

                .user-bio {
                    margin-bottom: 12px;
                    color: #606266;
                    line-height: 1.5;
                }

                .user-meta {
                    display: flex;
                    gap: 20px;
                    margin-bottom: 12px;

                    .meta-item {
                        display: flex;
                        align-items: center;
                        gap: 5px;
                        color: #909399;
                        font-size: 14px;

                        a {
                            color: #409EFF;
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
                    gap: 8px;

                    .user-tag {
                        margin: 0;
                    }
                }
            }

            .user-actions {
                display: flex;
                gap: 10px;
                align-self: flex-start;
                margin-top: 10px;
            }
        }
    }

    .user-panel-content {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
        padding: 20px;

        .user-tabs {
            width: 100%;
        }
    }
}

@media (max-width: 768px) {
    .user-panel-container {
        padding: 0 10px;

        .user-panel-header {
            .user-header-content {
                flex-direction: column;

                .user-avatar-container {
                    align-self: center;
                    margin-bottom: 15px; // 添加底部间距
                }

                .user-info-container {
                    margin-left: 0;
                    text-align: center;

                    .user-meta {
                        justify-content: center;
                    }

                    .user-tags {
                        justify-content: center;
                    }
                }

                .user-actions {
                    margin-top: 15px;
                    justify-content: center;
                }
            }
        }
    }
}
</style>