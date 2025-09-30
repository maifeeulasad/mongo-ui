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

export interface ElectronAPI {
  getVersion: () => Promise<string>
  getPlatform: () => Promise<NodeJS.Platform>
  showMessageBox: (options: any) => Promise<any>
  onMenuNewConnection: (callback: () => void) => void
  removeAllListeners: (channel: string) => void
}