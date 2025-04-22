import type { Character, Dialogue } from './types'

export function calculateRelationshipLines(
  characters: Character[],
  characterRefs: Record<string, HTMLElement | null>,
  dialogues: Dialogue[]
) {
  const lines: { start: string; end: string; path: string; type: string }[] = []
  
  // 创建一个映射来跟踪哪些角色之间有对话
  const characterRelations: Record<string, string[]> = {}
  
  // 根据对话数据构建角色关系
  dialogues.forEach(dialogue => {
    const participants = dialogue.participants
    
    // 对于每对参与者，记录他们之间的关系
    for (let i = 0; i < participants.length; i++) {
      for (let j = i + 1; j < participants.length; j++) {
        const char1 = participants[i]
        const char2 = participants[j]
        
        // 确保这两个角色在当前选中的组中
        if (characters.some(c => c.id === char1) && characters.some(c => c.id === char2)) {
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
  
  // 根据关系和DOM位置计算连线
  Object.keys(characterRelations).forEach(charId1 => {
    characterRelations[charId1].forEach(charId2 => {
      const el1 = characterRefs[charId1]
      const el2 = characterRefs[charId2]
      
      if (el1 && el2) {
        // 获取元素的位置和尺寸
        const rect1 = el1.getBoundingClientRect()
        const rect2 = el2.getBoundingClientRect()
        
        // 获取父容器的位置
        const parentRect = el1.parentElement?.getBoundingClientRect() || { left: 0, top: 0 }
        
        // 计算元素中心点相对于父容器的位置
        const x1 = rect1.left + rect1.width / 2 - parentRect.left
        const y1 = rect1.top + rect1.height / 2 - parentRect.top
        const x2 = rect2.left + rect2.width / 2 - parentRect.left
        const y2 = rect2.top + rect2.height / 2 - parentRect.top
        
        // 创建贝塞尔曲线路径
        const path = `M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`
        
        // 避免重复添加相同的线
        const existingLine = lines.find(
          line => (line.start === charId1 && line.end === charId2) || 
                 (line.start === charId2 && line.end === charId1)
        )
        
        if (!existingLine) {
          lines.push({
            start: charId1,
            end: charId2,
            path,
            type: 'character-character'
          })
        }
      }
    })
  })
  
  return lines
}