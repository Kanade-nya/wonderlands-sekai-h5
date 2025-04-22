import axios from 'axios';
import { localUrl } from '@/utils/methods';

// 煤炉数据相关接口
export const mercari = {
  // 获取煤炉数据列表
  getMercariData: async (keyword = null, page = 1, pageSize = 20) => {
    try {
      const params = { page, page_size: pageSize };
      if (keyword) params.keyword = keyword;
      
      const response = await axios.get(`${localUrl}/mercari/data`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 获取煤炉商品详情
  getMercariDetail: async (mId) => {
    try {
      const response = await axios.get(`${localUrl}/mercari/detail/${mId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};