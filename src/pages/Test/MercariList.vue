<template>
  <div class="mercari-container">
    <div class="search-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索商品名称"
        @keyup.enter="searchData"
        class="search-input"
      >
        <template #append>
          <el-button @click="searchData">搜索</el-button>
        </template>
      </el-input>
    </div>

    <el-table
      v-loading="loading"
      :data="mercariData"
      style="width: 100%"
      stripe
    >
      <el-table-column label="商品图片" width="180">
        <template #default="scope">
          <el-image
            :src="getImageUrl(scope.row.image_url) "
           
            fit="cover"
            style="width: 100px; height: 100px"
          >
            <template #error>
              <div class="image-error">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
        </template>
      </el-table-column>

      <el-table-column prop="item_name" label="商品名称" min-width="200">
        <template #default="scope">
          <div class="item-title">
            <span>{{ scope.row.item_name }}</span>
            <el-tag size="small" type="info">ID: {{ scope.row.m_id }}</el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="price" label="价格" width="120">
        <template #default="scope">
          <span class="price">¥{{ scope.row.price.toLocaleString() }}</span>
        </template>
      </el-table-column>

      <el-table-column label="时间信息" width="200">
        <template #default="scope">
          <div class="time-info">
            <div>创建：{{ formatDate(scope.row.create_time) }}</div>
            <div>更新：{{ formatDate(scope.row.update_time) }}</div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="showDetails(scope.row)"
          >
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      :page-sizes="[20, 50, 100]"
      layout="total, sizes, prev, pager, next"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      class="pagination"
    />

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="商品详情"
      width="60%"
    >
      <div v-if="selectedItem" class="item-details">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="商品ID">
            {{ selectedItem.m_id }}
          </el-descriptions-item>
          <el-descriptions-item label="商品名称">
            {{ selectedItem.item_name }}
          </el-descriptions-item>
          <el-descriptions-item label="价格">
            ¥{{ selectedItem.price.toLocaleString() }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ formatDate(selectedItem.create_time) }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            {{ formatDate(selectedItem.update_time) }}
          </el-descriptions-item>
          <el-descriptions-item label="商品描述">
            {{ selectedItem.item_description || '暂无描述' }}
          </el-descriptions-item>
        </el-descriptions>
        
        <div class="detail-image">
          <el-image
            :src="getImageUrl(selectedItem.image_url)"
            :preview-src-list="[getImageUrl(selectedItem.image_url)]"
            fit="contain"
            style="max-width: 100%; max-height: 400px"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000/mercari/api/mercari'

const mercariData = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const detailDialogVisible = ref(false)
const selectedItem = ref(null)

// BASE64 图片处理函数保持不变
const getImageUrl = (base64String) => {
  if (!base64String) return ''
  return `data:image/jpeg;base64,${base64String}`
}

// 格式化日期函数保持不变
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 更新获取数据的方法
const fetchData = async () => {
    scrollTo(0, 0)
  loading.value = true
  try {
    const response = await axios.get(`${API_BASE_URL}/data`, {
      params: {
        keyword: searchKeyword.value,
        page: currentPage.value,
        page_size: pageSize.value
      }
    })
    // 更新为新的响应格式
    mercariData.value = response.data.items
    total.value = response.data.total
    // // 如果当前页大于总页数，回到第一页
    // if (currentPage.value > response.data.total_pages) {
    //   currentPage.value = 1
    //   await fetchData()
    // }
  } catch (error) {
    ElMessage.error('获取数据失败')
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
}

// 搜索数据时重置到第一页
const searchData = () => {
  currentPage.value = 1
  scrollTo(0, 0)
  fetchData()
}

// 显示详情保持不变
const showDetails = (item) => {
  selectedItem.value = item
  detailDialogVisible.value = true
}

// 分页大小改变时重置到第一页
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  scrollTo(0, 0)
  fetchData()
}

// 页码改变
const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.mercari-container {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.search-input {
  max-width: 500px;
}

.item-title {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.price {
  color: #ff4500;
  font-weight: bold;
}

.time-info {
  font-size: 13px;
  color: #666;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.item-details {
  padding: 20px;
}

.detail-image {
  margin-top: 20px;
  text-align: center;
}

.image-error {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
}
</style>