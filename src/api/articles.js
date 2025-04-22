import axios from 'axios';
import { localUrl } from '@/utils/methods';

// 文章相关接口
export const articles = {
  // 获取文章列表
  getArticles: async (page = 1, size = 10, tag = null) => {
    try {
      const params = { page, size };
      if (tag) params.tag = tag;
      
      const response = await axios.get(`${localUrl}/articles/list`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 获取文章详情
  getArticleDetail: async (articleId) => {
    try {
      const response = await axios.get(`${localUrl}/articles/detail/${articleId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 创建文章
  createArticle: async (title, content, summary, tags = []) => {
    try {
      const response = await axios.post(`${localUrl}/articles/create`, {
        title,
        content,
        summary,
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

  // 更新文章
  updateArticle: async (articleId, title, content, summary, tags = []) => {
    try {
      const response = await axios.put(`${localUrl}/articles/update/${articleId}`, {
        title,
        content,
        summary,
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

  // 删除文章
  deleteArticle: async (articleId) => {
    try {
      const response = await axios.delete(`${localUrl}/articles/delete/${articleId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 获取用户文章列表
  getUserArticles: async (userId, page = 1, size = 10) => {
    try {
      const response = await axios.get(`${localUrl}/articles/user/${userId}`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 收藏文章
  collectArticle: async (articleId) => {
    try {
      const response = await axios.post(`${localUrl}/articles/collect/${articleId}`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 取消收藏文章
  uncollectArticle: async (articleId) => {
    try {
      const response = await axios.post(`${localUrl}/articles/uncollect/${articleId}`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 获取用户收藏列表
  getUserCollections: async (userId, page = 1, size = 10) => {
    try {
      const response = await axios.get(`${localUrl}/user/collections/${userId}`, {
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

  // 检查是否已收藏文章
  checkCollected: async (articleId) => {
    try {
      const response = await axios.get(`${localUrl}/articles/check-collected/${articleId}`, {
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