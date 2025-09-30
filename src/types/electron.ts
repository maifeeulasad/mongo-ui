import type { Connection } from './database'

export interface ElectronAPI {
  getVersion: () => Promise<string>
  getPlatform: () => Promise<NodeJS.Platform>
  showMessageBox: (options: any) => Promise<any>
  onMenuNewConnection: (callback: () => void) => void
  mongodb: {
    connect: (connection: Connection) => Promise<{ success: boolean; error?: string }>
    disconnect: (connectionId: string) => Promise<void>
    testConnection: (connection: Connection) => Promise<{ success: boolean; error?: string }>
    listDatabases: (connectionId: string) => Promise<string[]>
    listCollections: (connectionId: string, databaseName: string) => Promise<string[]>
    isConnected: (connectionId: string) => Promise<boolean>
    getDocuments: (connectionId: string, databaseName: string, collectionName: string, options?: any) => Promise<any>
    insertDocument: (connectionId: string, databaseName: string, collectionName: string, document: any) => Promise<any>
    updateDocument: (connectionId: string, databaseName: string, collectionName: string, documentId: string, document: any) => Promise<void>
    deleteDocument: (connectionId: string, databaseName: string, collectionName: string, documentId: string) => Promise<void>
  }
  removeAllListeners: (channel: string) => void
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}