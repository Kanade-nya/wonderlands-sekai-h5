export interface Character {
  id: string
  name: string
  avatar: string
}

export interface Group {
  id: string
  name: string
  characters: Character[]
}

export interface Dialogue {
  id: string
  content: string
  participants: string[] // characterIds
  timestamp: Date
}