export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  language: string
  autoConnect: boolean
  queryTimeout: number
  pageSize: number
}

export interface WindowState {
  width: number
  height: number
  isMaximized: boolean
  isFullscreen: boolean
}