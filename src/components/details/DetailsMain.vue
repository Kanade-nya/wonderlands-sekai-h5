<!-- 具体的图片链接-->
<template>
  <div class="page-container">
    <!-- 头部宣传区域 -->
    <details-title :title="box.title" :date="box.create_date" :character="box.character"
      :type="box.type"></details-title>


    <!-- 画集介绍区域 -->
    <div class="introduction">
      <h3>Introduction</h3>
      <!--			<p>日本画师椎名優(椎名优、しいな ゆう、Shiina Yuu)的小画集，跨页图有拼接痕迹。</p>-->
      <p>画师： {{ box.illustrator }}</p>
      <!--			<p>上传日期： {{box.create_date}}</p>-->
      <p>类型： {{ box.type }}</p>
      <div style="border-top: 1px solid #ccc;margin: 8px 0 "></div>
      <div class="description" v-html="box.description">
      </div>
    </div>

    <!-- 图片区域 -->
    <div class="image-list">
      <h3>Image</h3>
      <div class="line"></div>
      <div class="image-list-container">
        <!--				<img src="@/assets/img_1.png" class="listed-image">-->
        <!--				<img src="@/assets/e0a9ce33a7fef53e5557e9bc2b9dafbe3546749308242173.jpg" class="listed-image">-->
        <!--				<img src="@/assets/img.png" class="listed-image">-->
        <div v-for="(path, index) in box.image_url">
          <el-image class="listed-image" alt="" :src="path" :preview-src-list="getPreviewImages(index)" lazy>
          </el-image>
        </div>
      </div>
    </div>

    <!--	tags区域	-->
    <div class="tags">
      <h3>Tags</h3>
      <div class="tags-container">
        <el-tag v-for="item in tags" size="large" type="info" class="add-tag">{{ item }}</el-tag>
        <!-- 添加标签按钮 -->
        <el-tag @click="showAddTagDialog" size="large" type="info" class="add-tag"><el-icon>
            <Plus />
          </el-icon></el-tag>
      </div>
    </div>

    <!-- 添加标签对话框 -->
    <el-dialog v-model="tagDialogVisible" title="添加标签" width="30%" :before-close="handleCloseTagDialog">
      <el-form :model="tagForm">
        <el-form-item label="标签">
          <el-select v-model="tagForm.selectedTags" multiple filterable allow-create default-first-option
            placeholder="请输入或选择标签" style="width: 100%">
            <el-option v-for="tag in availableTags" :key="tag" :label="tag" :value="tag" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="tagDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addTags">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 更新记录区域 -->
    <div class="update-history">
      <h3>更新记录</h3>
      <div class="update-list">
        <el-timeline>
          <el-timeline-item
            v-for="(record, index) in updateRecords"
            :key="index"
            :timestamp="formatDate(record.updated_at)"
            placement="top"
            size="small"
            :type="index === updateRecords.length - 1 ? 'success' : 'primary'"
          >
            <div class="update-item">
              <div class="update-header">
                <span class="update-author">{{ record.updated_by || 'admin' }}</span>
                <!-- <el-tag size="small" :type="index === updateRecords.length - 1 ? 'success' : 'info'" effect="light">
                  {{ index === 0 ? '创建' : '更新' }}
                </el-tag> -->
              </div>
              <div class="update-details">
                <div v-for="(detail, detailKey) in record.update_details" :key="detailKey" class="detail-item">
                  <el-tag size="small" class="detail-tag" type="info" effect="plain">{{ translate(detailKey) }}</el-tag>
                  <span class="detail-content">{{ detail }}</span>
                </div>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>

    <!--		评论区域-->
    <div class="comments">
      <Waline :serverURL="serverURL" :path="path" :reaction="[]" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { ElTimeline, ElTimelineItem, ElCard, ElTag } from 'element-plus'
import DetailsTitle from "@/components/details/DetailsTitle.vue";
import { baseUrl, imageUrl, localUrl, formatDate } from "@/utils/methods.js";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage } from 'element-plus'; // 导入消息组件

// Waline评论面板
import { Waline } from '@waline/client/component';
import { useRoute } from 'vue-router';

import '@waline/client/style';
import requests from "@/utils/requests.js";

import { useGetIpStore } from "@/stores/useGetIpStore.js";
const { getIp } = useGetIpStore()


const serverURL = 'https://comments.wonderlands-sekai.space';
const path = computed(() => useRoute().path);


// const imageUrl = ref('https://lingma-vl.oss-rg-china-mainland.aliyuncs.com/cloud/CPlxwF91fytKRrml8tR004190ZvojZlzmU6U0P3s2ZM/0e408adf-4593-4195-ae29-6b4b97d7d150_1736484421300.png'); // 替换为实际的宣传图地址
const box = ref({})
const tags = ref([])
const updateRecords = ref([])
const translate = (word) => {
  switch (word) {
    case 'added_tags':
      return '添加标签';
    case 'action':
      return '创建';
    default:
      return word;
  }
}

const getPreviewImages = (index) => {
  let tempImgList = [...box.value.image_url];//所有图片地址
  if (index === 0) return tempImgList;
  // 调整图片顺序，把当前图片放在第一位
  let start = tempImgList.splice(index);
  let remain = tempImgList.splice(0, index);
  return start.concat(remain);
}

const props = defineProps({
  id: {
    type: String,
    required: true,
    default: ''
  }
})

// 获取更新记录
const fetchUpdateRecords = async (id) => {
  try {
    const response = await requests.get(
      `${localUrl}/tags/images/${id}/update-history`
    )
    if (response.status === 200 && response.data.update_history) {
      updateRecords.value = response.data.update_history;
      // 按时间倒序排列更新记录
      updateRecords.value.sort((a, b) => {
        return new Date(a.updated_at) - new Date(b.updated_at);
      });
      // console.log(updateRecords.value);
    }
  } catch (error) {
    console.error('获取更新记录失败:', error)
  }
}

onMounted(() => {
  // console.log(props.id)
  const firstLoading = ElLoading.service({
    text: '少女祈祷中...'
  })
  requests.get(
    `${baseUrl}/api2/website_image/${props.id}`,
    {
      params: {
        // id: props.id
      }
    }
  ).then(response => {
    // console.log(response.data)
    if (response.status === 200) {
      box.value = response.data.data
      let origin_urls = JSON.parse(box.value.image_url.replace(/'/g, '"'))
      let after_urls = origin_urls.map(item => {
        return `${imageUrl}/${item.split('/')[item.split('/').length - 1]}`
      })

      if (getIp() !== 'CN' && getIp() !== '') {
        box.value.image_url = after_urls
      } else {
        box.value.image_url = origin_urls
      }
      // console.log(origin_url)
      // box.value.image_url =  after_urls;
      box.value.description = box.value.description.replace(/\n/g, '<br>')
    }
    firstLoading.close()
    requests.get(
      `${localUrl}/tags/images/${props.id}/tags`
    ).then(response => {
      if (response.status === 200) {
        console.log(response.data)
        tags.value = response.data.tags
      }
    })
    // 获取更新记录
    fetchUpdateRecords(props.id)
  })
})



// 标签相关
const tagDialogVisible = ref(false);
const availableTags = ref([]); // 可用的标签列表
const tagForm = ref({
  selectedTags: []
});

// 显示添加标签对话框
const showAddTagDialog = () => {
  // 如果用户未登录，提示登录
  if (!localStorage.getItem('access_token')) {
    ElMessage.warning('请先登录后再添加标签');
    return;
  }
  tagDialogVisible.value = true;
  // 这里可以加载可用的标签列表，如果有API的话
  // loadAvailableTags();
};

// 关闭对话框
const handleCloseTagDialog = () => {
  tagDialogVisible.value = false;
  tagForm.value.selectedTags = [];
};

// 添加标签
const addTags = async () => {
  if (tagForm.value.selectedTags.length === 0) {
    ElMessage.warning('请至少选择一个标签');
    return;
  }

  try {
    // const token = localStorage.getItem('token');
    const response = await requests.post(
      `${localUrl}/tags/images/${props.id}/tags`,
      { tag_names: tagForm.value.selectedTags },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      }
    );

    if (response.status === 200) {
      ElMessage.success('标签添加成功');
      // 刷新标签列表
      const tagsResponse = await requests.get(
        `${localUrl}/tags/images/${props.id}/tags`
      );
      if (tagsResponse.status === 200) {
        tags.value = tagsResponse.data.tags;
      }
      // 刷新更新记录
      fetchUpdateRecords(props.id);
      // 关闭对话框
      tagDialogVisible.value = false;
      tagForm.value.selectedTags = [];
    }
  } catch (error) {
    console.error('添加标签失败:', error);
    ElMessage.error('添加标签失败，请稍后重试');
  }
};
//  标签相关结束
</script>

<style scoped lang="scss">
@media screen and (max-width: 768px) {
  .page-container {
    padding: 0 10px;

    .introduction {
      padding: 10px;
      margin-top: 15px;

      h3 {
        font-size: 18px;
        margin-bottom: 8px;
      }

      p {
        font-size: 14px;
        margin: 3px auto;
      }

      .description {
        font-size: 14px;
        line-height: 1.5;
      }
    }

    .image-list {
      padding: 10px;
      // margin-top: 15px;
      border-top: 1px solid #ccc;
      &>h3 {
        font-size: 18px;
        margin-bottom: 8px;
      }

      .image-list-container {
        padding: 0;

        .listed-image {
          margin-bottom: 10px;
        }
      }
    }

    .tags {
      padding: 10px;
      margin-top: 15px;

      h3 {
        font-size: 18px;
        margin-bottom: 8px;
      }

      .tags-container {
        gap: 8px;

        .el-tag {
          margin-bottom: 5px;
          font-size: 12px;
        }
      }

    .update-history {
      .update-list {
        padding: 4px 0;
        
        :deep(.el-timeline) {
          padding-left: 16px;
        }
        
        :deep(.el-timeline-item__node) {
          --el-timeline-node-size: 10px;
        }
        
        :deep(.el-timeline-item__wrapper) {
          padding-left: 20px;
        }
        
        :deep(.el-timeline-item__timestamp) {
          font-size: 12px;
          color: var(--el-text-color-secondary);
          margin-bottom: 4px;
        }
        
        .update-item {
          padding: 2px 0;
          
          .update-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
            
            .update-author {
              font-size: 13px;
              font-weight: 500;
              color: var(--el-text-color-primary);
            }
          }
          
          .update-details {
            .detail-item {
              display: flex;
              align-items: flex-start;
              margin: 4px 0;
              
              .detail-tag {
                flex-shrink: 0;
                margin-right: 6px;
                font-size: 12px;
              }
              
              .detail-content {
                font-size: 12px;
                color: var(--el-text-color-regular);
                word-break: break-word;
              }
            }
          }
        }
      }
    }

    .comments {
      margin-top: 15px;
      padding-left: 20px;
      padding-right: 20px;
    }
  }
}

// 更小屏幕的额外适配
@media screen and (max-width: 480px) {
  .page-container {

    .introduction,
    .image-list,
    .tags,
    .update-history {
      h3 {
        font-size: 16px;
      }
    }

    .introduction {

      p,
      .description {
        font-size: 13px;
      }
    }

    .update-history {
      .update-list {
        .update-item {
          .update-content {
            font-size: 12px;
          }
        }
      }
    }
  }
}

// 原有样式保持不变
.page-container {

  //   width: 100%;
  h3 {
    margin-top: 0;
  }

  .tags {
    h3 {
      border-bottom: 1px solid #ccc;
      padding-bottom: 5px;
    }

    .tags-container {
      display: flex;
      justify-content: left;
      flex-wrap: wrap;
      gap: 12px;

      span {
        cursor: pointer;
        color: #61666D;
      }
    }

    margin-top: 20px;
    padding: 12px 20px;
    // background-color: rgba(240, 248, 255, 0.3);
    border-radius: 10px;
  }

  .update-history {
    margin-top: 20px;
    padding: 12px 20px;
    border-radius: 10px;

    h3 {
      border-bottom: 1px solid #ccc;
      padding-bottom: 5px;
      margin-bottom: 12px;
    }

    .update-list {
      padding: 0;
      
      :deep(.el-timeline) {
        padding-left: 12px;
      }
      
      :deep(.el-timeline-item) {
        padding-bottom: 16px;
        
        &:last-child {
          padding-bottom: 0;
        }
      }
      
      :deep(.el-timeline-item__node) {
        --el-timeline-node-size: 8px;
        background-color: var(--el-color-primary);
      }
      
      :deep(.el-timeline-item__tail) {
        left: 4px;
        border-left: 1px solid #e4e7ed;
      }
      
      :deep(.el-timeline-item__wrapper) {
        padding-left: 18px;
        top: -3px;
      }
      
      :deep(.el-timeline-item__timestamp) {
        font-size: 12px;
        color: #909399;
        margin-bottom: 6px;
        line-height: 1.2;
      }
      
      .update-item {
        background-color: #f9f9f9;
        border-radius: 6px;
        padding: 8px 10px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        
        .update-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          height: 24px;
          
          .update-author {
            font-size: 13px;
            font-weight: 500;
            color: #303133;
          }
        }
        
        .update-details {
          .detail-item {
            .detail-item {
              display: flex;
              align-items: flex-start;
              margin: 6px 0;
              line-height: 1.5;
              
              &:first-child {
                margin-top: 0;
              }
              
              &:last-child {
                margin-bottom: 0;
              }
              
              .detail-tag {
                // height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                flex-shrink: 0;
                margin-right: 8px;
                font-size: 12px;
                height: 22px;
                line-height: 20px;
                padding: 0 6px;
                background-color: #f0f2f5;
                color: #606266;
                border-color: #e4e7ed;
                
              }
              
              .detail-content {
                font-size: 13px;
                color: #606266;
                word-break: break-word;
                padding-top: 1px;
                vertical-align: top;
              }
            }
          }
        }
      }
    }
  }
}

// 移动端适配
@media screen and (max-width: 768px) {
  .update-history {
    padding: 10px 15px;
    
    .update-list {
      :deep(.el-timeline) {
        padding-left: 8px;
      }
      
      :deep(.el-timeline-item__wrapper) {
        padding-left: 14px;
      }
      
      :deep(.el-timeline-item) {
        padding-bottom: 12px;
      }
      
      .update-item {
        padding: 6px 8px;
        
        .update-header {
          margin-bottom: 6px;
          height: 22px;
        }
        
        .update-details {
          .detail-item {
            margin: 4px 0;
            
            .detail-tag {
              margin-right: 6px;
            }
            
            .detail-content {
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}
}
.add-tag{
  margin: 4px;
}
.line{
  border-top: 1px var(--el-border-color) var(--el-border-style);
    display: block;
    height: 1px;
    // margin: 24px 0;
    width: 100%;
}
</style>
