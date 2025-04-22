import axios from 'axios';
import { localUrl } from '@/utils/methods';

// 用户认证相关接口
export const userAuth = {
    // 发送验证码
    sendVerificationCode: async (email) => {
        try {
            const response = await axios.post(`${localUrl}/user/send-code`, { email });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // 用户注册
    register: async (username, email, password, verificationCode) => {
        try {
            const response = await axios.post(`${localUrl}/user/register`, {
                username,
                email,
                password,
                verification_code: verificationCode
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // 用户登录
    login: async (username, password) => {
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const response = await axios.post(`${localUrl}/user/login`, formData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

// 用户信息相关接口
export const userProfile = {
    // 获取用户公开数据（不需要认证）
    getUserPublicData: async (userId) => {
        try {
            const response = await axios.get(`${localUrl}/user/public-data/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
    // 获取用户个人资料
    getUserProfile: async (userId) => {
        try {
            const response = await axios.get(`${localUrl}/user/profile/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // 更新用户个人资料
    updateUserProfile: async (description, blog) => {
        try {
            const response = await axios.post(`${localUrl}/user/update-profile`, {
                description,
                blog
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // 上传用户头像
    uploadAvatar: async (avatarUrl) => {
        try {
            const response = await axios.post(`${localUrl}/user/upload-avatar`, {
                avatar_url: avatarUrl
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

// 用户标签相关接口
export const userTags = {
    // 获取用户标签
    getUserTags: async (userId) => {
        try {
            const response = await axios.get(`${localUrl}/user/get-user-meta/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // 更新用户标签
    updateUserTags: async (tags) => {
        try {
            const response = await axios.post(`${localUrl}/user/update-meta`, {
                tags
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // 获取多个用户的标签信息
    getUsersMetaInfo: async (userIds) => {
        try {
            const response = await axios.post(`${localUrl}/user/get-users-meta-info`, {
                user_ids: userIds
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

// 用户社交相关接口
export const userSocial = {
    // 关注用户
    followUser: async (userId) => {
        try {
            const response = await axios.post(`${localUrl}/user/follow/${userId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // 取消关注用户
    unfollowUser: async (userId) => {
        try {
            const response = await axios.post(`${localUrl}/user/unfollow/${userId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // 检查是否已关注用户
    checkFollowing: async (userId) => {
        try {
            const response = await axios.get(`${localUrl}/user/check-following/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // 获取用户关注列表
    getUserFollowing: async (userId, page = 1, size = 10) => {
        try {
            const response = await axios.get(`${localUrl}/user/following/${userId}`, {
                params: { page, size },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // 获取用户粉丝列表
    getUserFollowers: async (userId, page = 1, size = 10) => {
        try {
            const response = await axios.get(`${localUrl}/user/followers/${userId}`, {
                params: { page, size },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};