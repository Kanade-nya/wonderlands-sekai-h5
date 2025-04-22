<template>
  <div class="submit-container">
    <h2 class="submit-title">提交新数据</h2>
    <div class="submit-form">
      <!-- 标题 -->
      <div class="form-item">
        <div class="label">标题</div>
        <el-input v-model="formData.title" placeholder="请输入标题" class="form-input" />
      </div>
      
      <!-- 图片上传 -->
      <div class="form-item">
        <div class="label">图片</div>
        <el-upload
          class="image-uploader"
          action="#"
          :http-request="uploadImage"
          :show-file-list="false"
          :before-upload="beforeImageUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="uploaded-image" />
          <el-icon v-else class="image-uploader-icon"><Plus /></el-icon>
        </el-upload>
        <div class="upload-tip">支持jpg、png格式，大小不超过5MB</div>
      </div>
      
      <!-- 描述 -->
      <div class="form-item">
        <div class="label">描述</div>
        <el-input
          v-model="formData.description"
          type="textarea"
          placeholder="请输入描述信息"
          class="form-textarea"
          :rows="4"
        />
      </div>
      
      <!-- 作者 -->
      <div class="form-item">
        <div class="label">作者</div>
        <el-input v-model="formData.artist" placeholder="请输入作者名称" class="form-input" />
      </div>
      
      <!-- 类型选择 -->
      <div class="form-item">
        <div class="label">类型</div>
        <el-select v-model="formData.typeId" placeholder="请选择类型" class="form-input">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      
      <!-- 提交按钮 -->
      <div class="submit-button-container">
        <el-button type="primary" @click="submitData" :loading="loading">提交审核</el-button>
        <el-button @click="goBack">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import requests from "@/utils/requests.js";
import { localUrl, baseUrl } from "@/utils/methods.js";
import { useUserInfoStore } from "@/stores/useUserInfoStore.js";

const router = useRouter();
const userInfoStore = useUserInfoStore();
const loading = ref(false);
const imageUrl = ref('');

// 表单数据
const formData = reactive({
  title: '',
  imageUrl: '',
  description: '',
  artist: '',
  typeId: ''
});

// 类型选项
const typeOptions = ref([
  { value: 1, label: '插画' },
  { value: 2, label: '漫画' },
  { value: 3, label: '摄影' },
  { value: 4, label: '设计' }
]);

// 图片上传前的验证
const beforeImageUpload = (file) => {
  const isJPG = file.type === 'image/jpeg';
  const isPNG = file.type === 'image/png';
  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!isJPG && !isPNG) {
    ElMessage.error('上传图片只能是JPG或PNG格式!');
    return false;
  }
  if (!isLt5M) {
    ElMessage.error('上传图片大小不能超过5MB!');
    return false;
  }
  return true;
};

// 上传图片
const uploadImage = async (options) => {
  try {
    // 这里应该调用你的图片上传API
    // 示例代码，实际实现可能需要根据你的后端API调整
    const formData = new FormData();
    formData.append('file', options.file);
    
    const response = await requests.post(
      `${baseUrl}/api/upload/image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      }
    );
    
    if (response.status === 200) {
      imageUrl.value = response.data.url;
      formData.imageUrl = response.data.url;
      ElMessage.success('图片上传成功');
    } else {
      ElMessage.error('图片上传失败');
    }
  } catch (error) {
    console.error('上传图片出错:', error);
    ElMessage.error('上传图片时发生错误');
  }
};

// 提交数据
const submitData = async () => {
  // 表单验证
  if (!formData.title) {
    return ElMessage.warning('请输入标题');
  }
  if (!formData.imageUrl && !imageUrl.value) {
    return ElMessage.warning('请上传图片');
  }
  if (!formData.description) {
    return ElMessage.warning('请输入描述');
  }
  if (!formData.typeId) {
    return ElMessage.warning('请选择类型');
  }
  
  try {
    loading.value = true;
    const response = await requests.post(
      `${localUrl}/api/pending-image/submit`,
      {
        title: formData.title,
        image_url: formData.imageUrl || imageUrl.value,
        description: formData.description,
        artist: formData.artist,
        type_id: formData.typeId
      },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      }
    );
    
    if (response.status === 200) {
      ElMessage.success('提交成功，等待审核');
      // 提交成功后返回个人资料页
      router.push('/user/profile');
    } else {
      ElMessage.error('提交失败');
    }
  } catch (error) {
    console.error('提交数据出错:', error);
    ElMessage.error('提交数据时发生错误');
  } finally {
    loading.value = false;
  }
};

// 返回上一页
const goBack = () => {
  router.push('/user/profile');
};
</script>

<style lang="scss" scoped>
.submit-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.submit-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.submit-form {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.form-item {
  margin-bottom: 20px;

  .label {
    font-size: 14px;
    color: #606266;
    margin-bottom: 10px;
  }

  .form-input, .form-textarea {
    width: 100%;
    font-size: 14px;
  }
}

.image-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 300px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  &:hover {
    border-color: #409EFF;
  }
}

.image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 30px;
  height: 30px;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.submit-button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
  gap: 10px;
}
</style>