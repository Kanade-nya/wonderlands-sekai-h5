import axios from 'axios';
import { localUrl } from '@/utils/methods';

// 标签相关接口
export const tags = {
  // 获取所有标签
  getAllTags: async () => {
    try {
      const response = await axios.get(`${localUrl}/tags/all`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 添加标签
  addTags: async (tagNames) => {
    try {
      const response = await axios.post(`${localUrl}/tags/add`, {
        tag_names: tagNames
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

  // 获取热门标签
  getHotTags: async (limit = 10) => {
    try {
      const response = await axios.get(`${localUrl}/tags/hot`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};