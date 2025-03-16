<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { localUrl } from '@/utils/methods.js';
import { Delete } from '@element-plus/icons-vue';
// 用户标签数据
const userTags = ref([]);
// 新标签表单
const newTag = reactive({
  content: '',
  color: '#409EFF' // 默认蓝色
});

// 是否正在提交
const isSubmitting = ref(false);

// 获取用户当前标签
const fetchUserTags = async () => {
  try {
    const response = await axios.get(
        `${localUrl}/user/get-user-meta`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        }
    );
    if (response.data && response.data.metas) {
      userTags.value = response.data.metas;
      console.log(userTags.value);
      
    }
  } catch (error) {
    console.error('获取用户标签失败:', error);
    ElMessage.error('获取用户标签失败');
  }
};

// 添加新标签
const addTag = () => {
  if (!newTag.content.trim()) {
    ElMessage.warning('标签内容不能为空');
    return;
  }
  
  // 检查是否已存在相同内容的标签
  const exists = userTags.value.some(tag => tag.content === newTag.content.trim());
  if (exists) {
    ElMessage.warning('已存在相同内容的标签');
    return;
  }
  
  // 添加到标签列表
  userTags.value.push({
    content: newTag.content.trim(),
    color: newTag.color
  });
  
  // 清空输入
  newTag.content = '';
  
  // 自动保存
  saveUserTags();
};

// 删除标签
const removeTag = (index) => {
  userTags.value.splice(index, 1);
  saveUserTags();
};

// 保存用户标签到服务器
const saveUserTags = async () => {
  isSubmitting.value = true;
  
  try {
    const response = await axios.post(`${localUrl}/user/update-meta`, {
      tags: userTags.value
    },{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    }
);
    
    if (response.status === 200) {
      ElMessage.success('标签更新成功');
    } else {
      ElMessage.error('标签更新失败');
    }
  } catch (error) {
    console.error('保存标签失败:', error);
    if (error.response && error.response.data && error.response.data.detail) {
      // 显示服务器返回的错误信息
      const errorMsg = error.response.data.detail.map(err => err.msg).join(', ');
      ElMessage.error(`保存失败: ${errorMsg}`);
    } else {
      ElMessage.error('保存标签失败，请稍后重试');
    }
  } finally {
    isSubmitting.value = false;
  }
};

// 页面加载时获取用户标签
onMounted(() => {
  fetchUserTags();
});
</script>

<template>
  <div class="user-meta-container">
    <h2 class="section-title">个人标签管理</h2>
    
    <div class="tag-input-section">
      <div class="input-group">
        <el-input 
          v-model="newTag.content" 
          placeholder="输入标签内容" 
          maxlength="20"
          show-word-limit
          @keyup.enter="addTag"
        />
        <el-color-picker v-model="newTag.color"  />
        <el-button type="primary" @click="addTag" :disabled="isSubmitting">添加标签</el-button>
      </div>
      
      <div class="tag-preview" v-if="newTag.content">
        <span class="preview-label">预览:</span>
        <span class="tag-item" :style="{ borderColor: newTag.color, color: newTag.color }">
          {{ newTag.content }}
        </span>
      </div>
    </div>
    
    <div class="tags-section">
      <h3 class="subsection-title">我的标签</h3>
      <div class="tags-list" v-if="userTags.length > 0">
        <div v-for="(tag, index) in userTags" :key="index" class="tag-item-container">
          <span class="tag-item" :style="{ borderColor: tag.color, color: tag.color }">
            {{ tag.content }}
          </span>
          <el-button type="danger" size="small" circle @click="removeTag(index)" class="remove-btn">
            <el-icon><Delete /></el-icon>
          </el-button>
        </div>
      </div>
      <div class="empty-tags" v-else>
        <el-empty description="暂无标签，请添加您的第一个标签" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-meta-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  
  .section-title {
    margin-bottom: 20px;
    font-size: 20px;
    color: #303133;
    border-bottom: 1px solid #ebeef5;
    padding-bottom: 10px;
  }
  
  .tag-input-section {
    margin-bottom: 30px;
    
    .input-group {
      display: flex;
      gap: 10px;
      margin-bottom: 15px;
      
      .el-input {
        flex: 1;
      }
    }
    
    .tag-preview {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 10px;
      
      .preview-label {
        font-size: 14px;
        color: #606266;
      }
    }
  }
  
  .tags-section {
    .subsection-title {
      font-size: 16px;
      margin-bottom: 15px;
      color: #606266;
    }
    
    .tags-list {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      
      .tag-item-container {
        display: flex;
        align-items: center;
        gap: 5px;
        
        .remove-btn {
          opacity: 0;
          transition: opacity 0.3s;
        }
        
        &:hover .remove-btn {
          opacity: 1;
        }
      }
    }
    
    .empty-tags {
      padding: 30px 0;
    }
  }
  
  .tag-item {
    padding: 2px 10px;
    border-radius: 4px;
    border: 1px solid;
    font-size: 12px;
    display: inline-flex;
    align-items: center;
    height: 24px;
    box-sizing: border-box;
    background-color: transparent;
  }
}
</style>