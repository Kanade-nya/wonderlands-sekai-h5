// 导出所有API模块
import { userAuth, userProfile, userTags, userSocial } from './user';
import { articles } from './articles';
import { tags } from './tags';
import { mercari } from './mercari';

export {
  userAuth,
  userProfile,
  userTags,
  userSocial,
  articles,
  tags,
  mercari
};

// 创建一个统一的API对象
const api = {
  user: {
    auth: userAuth,
    profile: userProfile,
    tags: userTags,
    social: userSocial
  },
  articles,
  tags,
  mercari
};

export default api;