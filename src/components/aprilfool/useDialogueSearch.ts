import { computed, type Ref } from 'vue'
import type { Dialogue } from './types'

export function useDialogueSearch(
  dialogues: Ref<Dialogue[]>,
  selectedCharacterIds: Ref<string[]>
) {
  // 根据选中的角色过滤对话
  const filteredDialogues = computed(() => {
    if (selectedCharacterIds.value.length === 0) {
      return []
    }
    
    return dialogues.value.filter(dialogue => {
      // 检查对话的参与者是否包含任何选中的角色
      return selectedCharacterIds.value.some(characterId => 
        dialogue.participants.includes(characterId)
      )
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()) // 按时间降序排序
  })

  return {
    filteredDialogues
  }
}