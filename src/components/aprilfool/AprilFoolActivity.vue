<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, shallowRef, nextTick } from 'vue'
import { ElDialog, ElBadge } from 'element-plus'
import { useDialogueSearch } from './useDialogueSearch'
import type { Group, Dialogue, Character } from './types'

// 使用shallowRef优化性能
const groups = shallowRef<Group[]>([
  {
    id: 'group1',
    name: '青春组合',
    characters: [
      { id: 'char1', name: '小明', avatar: '/avatars/xiaoming.png' },
      { id: 'char2', name: '小红', avatar: '/avatars/xiaohong.png' },
      { id: 'char3', name: '小刚', avatar: '/avatars/xiaogang.png' }
    ]
  },
  {
    id: 'group2',
    name: '冒险小队',
    characters: [
      { id: 'char4', name: '阿丽', avatar: '/avatars/ali.png' },
      { id: 'char5', name: '大山', avatar: '/avatars/dashan.png' },
      { id: 'char6', name: '小雨', avatar: '/avatars/xiaoyu.png' }
    ]
  },
  {
    id: 'group3',
    name: '神秘团体',
    characters: [
      { id: 'char7', name: '老王', avatar: '/avatars/laowang.png' },
      { id: 'char8', name: '小李', avatar: '/avatars/xiaoli.png' },
      { id: 'char9', name: '大张', avatar: '/avatars/dazhang.png' }
    ]
  },
  {
    id: 'group4',
    name: '奇幻四人组',
    characters: [
      { id: 'char10', name: '魔法师', avatar: '/avatars/mofashi.png' },
      { id: 'char11', name: '战士', avatar: '/avatars/zhanshi.png' },
      { id: 'char12', name: '弓箭手', avatar: '/avatars/gongjianshi.png' }
    ]
  },
  {
    id: 'group5',
    name: '科学小组',
    characters: [
      { id: 'char13', name: '博士', avatar: '/avatars/boshi.png' },
      { id: 'char14', name: '助手', avatar: '/avatars/zhushou.png' },
      { id: 'char15', name: '实习生', avatar: '/avatars/shixisheng.png' }
    ]
  }
])

const dialogues = shallowRef<Dialogue[]>([
  {
    id: 'dialog1',
    content: '# 神秘对话\n\n小明: 你们知道今天是什么日子吗？\n小红: 4月1日啊，怎么了？\n小明: *偷笑* 没什么，只是提醒一下大家要小心...',
    participants: ['char1', 'char2'],
    timestamp: new Date('2023-04-01T09:00:00')
  },
  {
    id: 'dialog2',
    content: '# 冒险计划\n\n阿丽: 我们今天去哪探险？\n大山: 听说学校后山有个神秘洞穴\n小雨: 真的吗？我有点害怕...\n阿丽: 别担心，今天是愚人节，肯定是大山在开玩笑',
    participants: ['char4', 'char5', 'char6'],
    timestamp: new Date('2023-04-01T10:30:00')
  },
  {
    id: 'dialog3',
    content: '# 跨组对话\n\n小明: 听说你们要去探险？\n阿丽: 是啊，要一起来吗？\n小红: 我也想去！\n大山: 人越多越好玩！',
    participants: ['char1', 'char2', 'char4', 'char5'],
    timestamp: new Date('2023-04-01T11:15:00')
  },
  // 更多对话...
])

// 状态管理
const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const selectedCharacterIds = ref<string[]>([])
const dialogVisible = ref(false)
const currentDialogue = ref<Dialogue | null>(null)

// Canvas相关状态
const mainCardPosition = ref({ x: 0, y: 0, radius: 80 })
const groupPositions = ref<{id: string, x: number, y: number, radius: number, angle: number, active: boolean}[]>([])
const characterPositions = ref<{id: string, groupId: string, x: number, y: number, radius: number, angle: number, selected: boolean}[]>([])
const activeGroupId = ref<string | null>(null)
const isMainCardActive = ref(false)
const animationFrameId = ref<number | null>(null)

// 计算属性
const { filteredDialogues } = useDialogueSearch(dialogues, selectedCharacterIds)

// 初始化Canvas
const initCanvas = () => {
  const canvas = canvasRef.value
  const container = containerRef.value
  if (!canvas || !container) return
  
  // 设置Canvas尺寸
  canvas.width = container.clientWidth
  canvas.height = container.clientHeight
  
  // 初始化主卡片位置
  mainCardPosition.value = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 80
  }
  
  // 初始化组位置（但不显示）
  initGroupPositions()
  
  // 开始动画循环
  startAnimationLoop()
}

// 初始化组位置
const initGroupPositions = () => {
  groupPositions.value = groups.value.map((group, index) => {
    const angle = (index / groups.value.length) * Math.PI * 2
    return {
      id: group.id,
      x: 0, // 将在动画中计算
      y: 0, // 将在动画中计算
      radius: 60,
      angle,
      active: false
    }
  })
}

// 计算组的位置（围绕主卡片）
const calculateGroupPositions = () => {
  if (!isMainCardActive.value) {
    // 如果主卡片未激活，将组移到远处（不可见）
    groupPositions.value.forEach(group => {
      group.x = -200
      group.y = -200
    })
    return
  }
  
  const radius = 250 // 环绕半径
  groupPositions.value.forEach((group, index) => {
    const angle = (index / groups.value.length) * Math.PI * 2
    const targetX = mainCardPosition.value.x + Math.cos(angle) * radius
    const targetY = mainCardPosition.value.y + Math.sin(angle) * radius
    
    // 平滑过渡到目标位置
    group.x = group.x + (targetX - group.x) * 0.1
    group.y = group.y + (targetY - group.y) * 0.1
    group.angle = angle
  })
}

// 计算角色的位置（围绕选中的组）
const calculateCharacterPositions = () => {
  // 如果没有活跃的组，清空角色位置
  if (!activeGroupId.value) {
    characterPositions.value = []
    return
  }
  
  const activeGroup = groups.value.find(g => g.id === activeGroupId.value)
  const groupPosition = groupPositions.value.find(g => g.id === activeGroupId.value)
  
  if (!activeGroup || !groupPosition) return
  
  // 检查是否已经为当前组计算了角色位置
  const existingCharacters = characterPositions.value.filter(c => c.groupId === activeGroupId.value)
  
  // 如果已经计算过，只更新位置而不重新生成角度
  if (existingCharacters.length > 0) {
    characterPositions.value = existingCharacters.map(character => {
      // 使用已有的角度，只更新坐标
      return {
        ...character,
        x: groupPosition.x + Math.cos(character.angle) * 180,
        y: groupPosition.y + Math.sin(character.angle) * 180,
        selected: selectedCharacterIds.value.includes(character.id)
      }
    })
    return
  }
  
  // 为选中组的每个角色创建位置（首次计算）
  const characters = activeGroup.characters
  const radius = 180 // 角色环绕半径
  
  characterPositions.value = characters.map((character, index) => {
    // 随机角度，但保持一定间距
    const baseAngle = (index / characters.length) * Math.PI * 2
    const randomOffset = (Math.random() - 0.5) * 0.3 // 添加一些随机性
    const angle = baseAngle + randomOffset
    
    return {
      id: character.id,
      groupId: activeGroup.id,
      x: groupPosition.x + Math.cos(angle) * radius,
      y: groupPosition.y + Math.sin(angle) * radius,
      radius: 50,
      angle, // 保存角度以便后续使用
      selected: selectedCharacterIds.value.includes(character.id)
    }
  })
}

// 绘制Canvas
const drawCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  // 清除画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // 绘制连接线
  drawConnections(ctx)
  
  // 绘制主卡片
  drawMainCard(ctx)
  
  // 绘制组卡片
  drawGroupCards(ctx)
  
  // 绘制角色卡片
  drawCharacterCards(ctx)
}

// 绘制连接线
const drawConnections = (ctx: CanvasRenderingContext2D) => {
  // 绘制主卡片到组的连接线
  if (isMainCardActive.value) {
    groupPositions.value.forEach(group => {
      if (group.x > 0 && group.y > 0) { // 只绘制可见的组
        ctx.beginPath()
        ctx.moveTo(mainCardPosition.value.x, mainCardPosition.value.y)
        
        // 贝塞尔曲线使连线更平滑
        const controlX = (mainCardPosition.value.x + group.x) / 2
        const controlY = (mainCardPosition.value.y + group.y) / 2
        
        ctx.quadraticCurveTo(controlX, controlY, group.x, group.y)
        
        ctx.strokeStyle = group.id === activeGroupId.value ? '#FFD700' : '#409EFF'
        ctx.lineWidth = 2
        ctx.stroke()
      }
    })
  }
  
  // 绘制组到角色的连接线
  if (activeGroupId.value) {
    const activeGroup = groupPositions.value.find(g => g.id === activeGroupId.value)
    if (activeGroup) {
      characterPositions.value.forEach(character => {
        ctx.beginPath()
        ctx.moveTo(activeGroup.x, activeGroup.y)
        
        // 贝塞尔曲线
        const controlX = (activeGroup.x + character.x) / 2
        const controlY = (activeGroup.y + character.y) / 2
        
        ctx.quadraticCurveTo(controlX, controlY, character.x, character.y)
        
        ctx.strokeStyle = character.selected ? '#FFD700' : '#409EFF'
        ctx.lineWidth = character.selected ? 3 : 2
        ctx.stroke()
      })
    }
  }
  
  // 绘制角色之间的关系线
  drawCharacterRelationships(ctx)
}

// 绘制角色之间的关系线
const drawCharacterRelationships = (ctx: CanvasRenderingContext2D) => {
  if (characterPositions.value.length < 2) return
  
  // 创建一个映射来跟踪哪些角色之间有对话
  const characterRelations: Record<string, string[]> = {}
  
  // 根据对话数据构建角色关系
  dialogues.value.forEach(dialogue => {
    const participants = dialogue.participants
    
    // 对于每对参与者，记录他们之间的关系
    for (let i = 0; i < participants.length; i++) {
      for (let j = i + 1; j < participants.length; j++) {
        const char1 = participants[i]
        const char2 = participants[j]
        
        // 确保这两个角色在当前显示的角色中
        if (characterPositions.value.some(c => c.id === char1) && 
            characterPositions.value.some(c => c.id === char2)) {
          if (!characterRelations[char1]) {
            characterRelations[char1] = []
          }
          if (!characterRelations[char2]) {
            characterRelations[char2] = []
          }
          
          if (!characterRelations[char1].includes(char2)) {
            characterRelations[char1].push(char2)
          }
          if (!characterRelations[char2].includes(char1)) {
            characterRelations[char2].push(char1)
          }
        }
      }
    }
  })
  
  // 绘制关系线
  Object.keys(characterRelations).forEach(charId1 => {
    characterRelations[charId1].forEach(charId2 => {
      const char1 = characterPositions.value.find(c => c.id === charId1)
      const char2 = characterPositions.value.find(c => c.id === charId2)
      
      if (char1 && char2) {
        ctx.beginPath()
        ctx.moveTo(char1.x, char1.y)
        
        // 贝塞尔曲线
        const controlX = (char1.x + char2.x) / 2
        const controlY = (char1.y + char2.y) / 2 - 30 // 向上弯曲
        
        ctx.quadraticCurveTo(controlX, controlY, char2.x, char2.y)
        
        // 如果两个角色都被选中，使用高亮样式
        const isHighlighted = char1.selected && char2.selected
        
        if (isHighlighted) {
          ctx.strokeStyle = '#FFD700'
          ctx.lineWidth = 3
          ctx.setLineDash([])
        } else {
          ctx.strokeStyle = '#dcdfe6'
          ctx.lineWidth = 2
          ctx.setLineDash([5, 3])
        }
        
        ctx.stroke()
      }
    })
  })
}

// 绘制主卡片
const drawMainCard = (ctx: CanvasRenderingContext2D) => {
  const { x, y, radius } = mainCardPosition.value
  
  // 绘制圆形背景
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fillStyle = isMainCardActive.value ? '#409EFF' : '#67C23A'
  ctx.fill()
  
  // 绘制边框
  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = 3
  ctx.stroke()
  
  // 绘制文字
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 16px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('愚人节', x, y - 10)
  ctx.fillText('特别活动', x, y + 10)
}

// 绘制组卡片
const drawGroupCards = (ctx: CanvasRenderingContext2D) => {
  groupPositions.value.forEach(group => {
    if (group.x < 0 || group.y < 0) return // 跳过不可见的组
    
    const { x, y, radius } = group
    const isActive = group.id === activeGroupId.value
    
    // 绘制圆形背景
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fillStyle = isActive ? '#E6A23C' : '#909399'
    ctx.fill()
    
    // 绘制边框
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // 绘制文字
    const groupData = groups.value.find(g => g.id === group.id)
    if (groupData) {
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 14px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // 如果名称太长，分行显示
      const name = groupData.name
      if (name.length > 6) {
        const firstLine = name.substring(0, 4)
        const secondLine = name.substring(4)
        ctx.fillText(firstLine, x, y - 8)
        ctx.fillText(secondLine, x, y + 8)
      } else {
        ctx.fillText(name, x, y)
      }
    }
  })
}

// 绘制角色卡片
const drawCharacterCards = (ctx: CanvasRenderingContext2D) => {
  characterPositions.value.forEach(character => {
    const { x, y, radius, selected } = character
    
    // 绘制圆形背景
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fillStyle = selected ? '#FFD700' : '#FFFFFF'
    ctx.fill()
    
    // 绘制边框
    ctx.strokeStyle = selected ? '#E6A23C' : '#DCDFE6'
    ctx.lineWidth = selected ? 3 : 2
    ctx.stroke()
    
    // 绘制角色名称
    const characterData = groups.value
      .flatMap(g => g.characters)
      .find(c => c.id === character.id)
    
    if (characterData) {
      // 绘制头像（简化为圆形色块，实际应用中可加载图片）
      ctx.beginPath()
      ctx.arc(x, y - 10, radius * 0.6, 0, Math.PI * 2)
      ctx.fillStyle = selected ? '#F56C6C' : '#409EFF'
      ctx.fill()
      
      // 绘制名称
      ctx.fillStyle = '#333333'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(characterData.name, x, y + radius * 0.5)
    }
  })
}

// 动画循环
const startAnimationLoop = () => {
  const animate = () => {
    calculateGroupPositions()
    calculateCharacterPositions()
    drawCanvas()
    animationFrameId.value = requestAnimationFrame(animate)
  }
  
  animate()
}

// 停止动画
const stopAnimationLoop = () => {
  if (animationFrameId.value !== null) {
    cancelAnimationFrame(animationFrameId.value)
    animationFrameId.value = null
  }
}

// 处理Canvas点击事件
const handleCanvasClick = (event: MouseEvent) => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  // 检查是否点击了主卡片
  if (isPointInCircle(x, y, mainCardPosition.value)) {
    isMainCardActive.value = !isMainCardActive.value
    if (!isMainCardActive.value) {
      // 如果关闭主卡片，清除所有选择
      activeGroupId.value = null
      selectedCharacterIds.value = []
    }
    return
  }
  
  // 检查是否点击了组卡片
  for (const group of groupPositions.value) {
    if (isPointInCircle(x, y, group)) {
      activeGroupId.value = activeGroupId.value === group.id ? null : group.id
      // 如果切换组，清除角色选择
      if (activeGroupId.value !== group.id) {
        selectedCharacterIds.value = []
      }
      return
    }
  }
  
  // 检查是否点击了角色卡片
  for (const character of characterPositions.value) {
    if (isPointInCircle(x, y, character)) {
      toggleCharacterSelection(character.id, event)
      return
    }
  }
}

// 判断点是否在圆内
const isPointInCircle = (x: number, y: number, circle: {x: number, y: number, radius: number}) => {
  const dx = x - circle.x
  const dy = y - circle.y
  return dx * dx + dy * dy <= circle.radius * circle.radius
}

// 切换角色选择
const toggleCharacterSelection = (characterId: string, event: MouseEvent) => {
  // 如果没有按Ctrl键，清除之前的选择
  if (!event.ctrlKey) {
    selectedCharacterIds.value = []
  }
  
  // 愚人节彩蛋：10%概率反向选择
  if (isAprilFoolsDay() && Math.random() < 0.1) {
    if (confirm('愚人节快乐！要反向选择吗？')) {
      const index = selectedCharacterIds.value.indexOf(characterId)
      if (index === -1) {
        selectedCharacterIds.value = selectedCharacterIds.value.filter(id => id !== characterId)
      } else {
        selectedCharacterIds.value.push(characterId)
      }
      return
    }
  }
  
  // 正常选择逻辑
  const index = selectedCharacterIds.value.indexOf(characterId)
  if (index === -1) {
    selectedCharacterIds.value.push(characterId)
  } else {
    selectedCharacterIds.value.splice(index, 1)
  }
  
  // 更新角色位置的选中状态
  characterPositions.value.forEach(char => {
    if (char.id === characterId) {
      char.selected = selectedCharacterIds.value.includes(characterId)
    }
  })
}

// 打开对话
const openDialogue = (dialogue: Dialogue) => {
  currentDialogue.value = dialogue
  dialogVisible.value = true
}

// 判断是否是愚人节
const isAprilFoolsDay = () => {
  const today = new Date()
  return today.getMonth() === 3 && today.getDate() === 1
}

// 格式化时间戳
const formatTimestamp = (timestamp: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(timestamp)
}

// 窗口大小变化时重新初始化Canvas
const handleResize = () => {
  initCanvas()
}

// 生命周期钩子
onMounted(() => {
  window.addEventListener('resize', handleResize)
  nextTick(() => {
    initCanvas()
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  stopAnimationLoop()
})
</script>

<template>
  <div class="april-fool-activity">
    <!-- Canvas容器 -->
    <div class="activity-container" ref="containerRef">
      <canvas 
        ref="canvasRef" 
        class="relationship-canvas"
        @click="handleCanvasClick"
      ></canvas>
      
      <!-- 提示信息 -->
      <div class="canvas-instructions" v-if="!isMainCardActive">
        <p>点击中央的"愚人节特别活动"圆圈开始探索</p>
      </div>
      
      <div class="canvas-instructions" v-else-if="!activeGroupId">
        <p>点击周围的组合圆圈查看角色</p>
      </div>
      
      <div class="canvas-instructions" v-else-if="selectedCharacterIds.length === 0">
        <p>点击角色圆圈选择角色，按住Ctrl可多选</p>
      </div>
    </div>

    <!-- 对话系统 -->
    <div class="dialogue-panel" v-if="selectedCharacterIds.length > 0">
      <h3>对话列表 ({{ filteredDialogues.length }})</h3>
      <div class="dialogue-list">
        <div
          v-for="dialogue in filteredDialogues"
          :key="dialogue.id"
          class="dialogue-item"
          @click="openDialogue(dialogue)"
          tabindex="0"
          :aria-label="`打开对话: ${dialogue.content.split('\n')[0]}`"
        >
          <div class="dialogue-participants">
            <div
              v-for="participantId in dialogue.participants"
              :key="participantId"
              class="dialogue-participant"
            >
              <img 
                :src="groups.value.flatMap(g => g.characters).find(c => c.id === participantId)?.avatar" 
                :alt="groups.value.flatMap(g => g.characters).find(c => c.id === participantId)?.name"
                class="participant-avatar"
              />
            </div>
          </div>
          <div class="dialogue-preview">
            {{ dialogue.content.split('\n')[0].replace(/^# /, '') }}
          </div>
          <div class="dialogue-timestamp">
            {{ formatTimestamp(dialogue.timestamp) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 对话弹窗 -->
    <ElDialog
      v-model="dialogVisible"
      :title="currentDialogue?.content.split('\n')[0].replace(/^# /, '')"
      width="60%"
      class="dialogue-dialog"
    >
      <template #header>
        <div class="dialogue-dialog-header">
          <h3>{{ currentDialogue?.content.split('\n')[0].replace(/^# /, '') }}</h3>
          <div class="dialogue-participants-header">
            <div
              v-for="participantId in currentDialogue?.participants || []"
              :key="participantId"
              class="dialogue-participant"
            >
              <img 
                :src="groups.value.flatMap(g => g.characters).find(c => c.id === participantId)?.avatar" 
                :alt="groups.value.flatMap(g => g.characters).find(c => c.id === participantId)?.name"
                class="participant-avatar"
              />
              <span>{{ groups.value.flatMap(g => g.characters).find(c => c.id === participantId)?.name }}</span>
            </div>
          </div>
        </div>
      </template>
      
      <div class="dialogue-content">
        <!-- 使用v-html渲染Markdown内容 -->
        <div v-if="currentDialogue" v-html="currentDialogue.content.replace(/^# .*\n\n/, '').replace(/\n/g, '<br>')"></div>
      </div>
      
      <div class="dialogue-footer">
        <div class="dialogue-timestamp" :class="{ 'april-fool': isAprilFoolsDay() }">
          {{ currentDialogue ? formatTimestamp(currentDialogue.timestamp) : '' }}
        </div>
      </div>
    </ElDialog>
  </div>
</template>

<style scoped lang="scss">
.april-fool-activity {
  display: flex;
  width: 100%;
  min-height: 80vh;
  gap: 20px;
  
  .activity-container {
    flex: 1;
    position: relative;
    background-color: #f5f7fa;
    border-radius: 8px;
    min-height: 600px;
    overflow: hidden;
    
    .relationship-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
    
    .canvas-instructions {
      position: absolute;
      bottom: 20px;
      left: 0;
      width: 100%;
      text-align: center;
      color: #909399;
      background-color: rgba(255, 255, 255, 0.7);
      padding: 10px;
      border-radius: 4px;
      pointer-events: none; // 允许点击穿透
    }
  }
  
  // 对话面板样式保持不变
  .dialogue-panel {
    width: 30%;
    background-color: #f5f7fa;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    
    h3 {
      margin-top: 0;
      margin-bottom: 15px;
      border-bottom: 1px solid #dcdfe6;
      padding-bottom: 10px;
    }
    
    .dialogue-list {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .dialogue-item {
      background-color: white;
      border-radius: 8px;
      padding: 15px;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
      
      .dialogue-participants {
        display: flex;
        gap: 5px;
        margin-bottom: 10px;
        
        .dialogue-participant {
          .participant-avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            object-fit: cover;
          }
        }
      }
      
      .dialogue-preview {
        font-weight: bold;
        margin-bottom: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .dialogue-timestamp {
        font-size: 12px;
        color: #909399;
      }
    }
  }
  
  .dialogue-dialog {
    .dialogue-dialog-header {
      h3 {
        margin-top: 0;
      }
      
      .dialogue-participants-header {
        display: flex;
        gap: 10px;
        margin-top: 10px;
        
        .dialogue-participant {
          display: flex;
          align-items: center;
          gap: 5px;
          
          .participant-avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            object-fit: cover;
          }
        }
      }
    }
    
    .dialogue-content {
      margin: 20px 0;
      line-height: 1.6;
    }
    
    .dialogue-footer {
      display: flex;
      justify-content: flex-end;
      
      .dialogue-timestamp {
        font-size: 14px;
        color: #909399;
        
        &.april-fool {
          color: #E6A23C;
          font-weight: bold;
          animation: pulse 2s infinite;
        }
      }
    }
  }
  
  // 愚人节彩蛋动画
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  // 响应式布局
  @media screen and (max-width: 768px) {
    flex-direction: column;
    
    .dialogue-panel {
      width: 100%;
      margin-top: 20px;
    }
  }
}
</style>