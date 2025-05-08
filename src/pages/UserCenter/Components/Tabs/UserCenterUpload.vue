<!-- 用户上传数据界面 -->
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { localUrl } from '@/utils/methods.js'; // 导入你的方法文件

const router = useRouter();
// 用户上传的待审核图片数据
const uploadedItems = ref([]);
const loading = ref(false);

// 获取用户的待审核图片列表
const fetchUserPendingImages = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`${localUrl}/user-center/user-pending-images`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    
    // 处理返回的数据，将JSON字符串转换为对象
    uploadedItems.value = response.data.map(item => {
      // 解析JSON字符串
      const imageUrls = JSON.parse(item.image_url);
      const firstImageUrl = imageUrls.length > 0 ? imageUrls[0] : '';
      
      // 转换状态码为文字描述
      let statusText = '未知';
      switch(item.status) {
        case 0: statusText = '审核中'; break;
        case 1: statusText = '已通过'; break;
        case 2: statusText = '已拒绝'; break;
      }
      
      return {
        id: item.id,
        name: item.title,
        submitTime: new Date(item.create_date).toLocaleString(),
        status: statusText,
        imageUrl: firstImageUrl
      };
    });
  } catch (error) {
    console.error('获取待审核图片失败:', error);
    ElMessage.error('获取待审核图片失败');
  } finally {
    loading.value = false;
  }
};

// 获取状态对应的标签类型
const getStatusType = (status) => {
  switch(status) {
    case '已通过': return 'success';
    case '审核中': return 'warning';
    case '已拒绝': return 'danger';
    default: return 'info';
  }
};

// 跳转到上传主界面
const jump2UploadMainData = () => {
  router.push({
    path: '/user/center/upload/data'
  });
};

// 查看图片详情
const viewImageDetails = (id) => {
  // 可以实现查看详情的逻辑，例如跳转到详情页
  console.log('查看图片ID:', id);
};

// 删除待审核图片
const deleteImage = async (id) => {
  // 这里可以实现删除逻辑，需要后端提供删除API
  console.log('删除图片ID:', id);
};

// 组件挂载时获取数据
onMounted(() => {
  fetchUserPendingImages();
});
</script>

<template>
  <div>
    <div class="user-center-upload-new">
      <el-button type="primary" @click="jump2UploadMainData">提交新数据</el-button>
    </div>
    <div class="user-center-upload-details">
      <h3>已上传内容</h3>
      <el-table v-loading="loading" :data="uploadedItems" style="width: 100%" stripe>
        <el-table-column prop="name" label="名称" min-width="180" />
        <el-table-column label="预览图" min-width="120">
          <template #default="scope">
            <el-image 
              v-if="scope.row.imageUrl" 
              :src="scope.row.imageUrl" 
              style="width: 80px; height: 80px; object-fit: cover;"
              :preview-src-list="[scope.row.imageUrl]"
            />
            <span v-else>无预览图</span>
          </template>
        </el-table-column>
        <el-table-column prop="submitTime" label="提交时间" min-width="150" />
        <el-table-column label="状态" min-width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" type="primary" plain @click="viewImageDetails(scope.row.id)">查看</el-button>
            <el-button size="small" type="danger" plain @click="deleteImage(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="empty-placeholder" v-if="uploadedItems.length === 0 && !loading">
        暂无上传内容
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-center-upload-new {
  // padding: 0 16px;
}
.user-center-upload-details {
  width: calc(100%);
  margin: 20px auto;
  padding: 16px 0;
  background-color: #fff;
  border-radius: 8px;
  // box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  h3 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 18px;
    color: #303133;
    width: 100%;
  }

  .empty-placeholder {
    padding: 30px 0;
    text-align: center;
    color: #909399;
    font-size: 14px;
    width: 100%;
  }
}
</style>