/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

// Electron API types
interface Connection {
  id: string
  name: string
  host: string
  port: number
  database?: string
  username?: string
  password?: string
  ssl: boolean
  authDatabase?: string
  connectionString?: string
  isConnected: boolean
  lastConnected?: Date
  createdAt: Date
}

interface ElectronAPI {
  getVersion: () => Promise<string>
  getPlatform: () => Promise<NodeJS.Platform>
  showMessageBox: (options: Electron.MessageBoxOptions) => Promise<Electron.MessageBoxReturnValue>
  onMenuNewConnection: (callback: () => void) => void
  mongodb: {
    connect: (connection: Connection) => Promise<{ success: boolean; error?: string }>
    disconnect: (connectionId: string) => Promise<void>
    testConnection: (connection: Connection) => Promise<{ success: boolean; error?: string }>
    listDatabases: (connectionId: string) => Promise<string[]>
    listCollections: (connectionId: string, databaseName: string) => Promise<string[]>
    getDocuments: (connectionId: string, databaseName: string, collectionName: string, options?: any) => Promise<{ documents: any[], total: number }>
    insertDocument: (connectionId: string, databaseName: string, collectionName: string, document: any) => Promise<string>
    updateDocument: (connectionId: string, databaseName: string, collectionName: string, documentId: string, document: any) => Promise<void>
    deleteDocument: (connectionId: string, databaseName: string, collectionName: string, documentId: string) => Promise<void>
    isConnected: (connectionId: string) => Promise<boolean>
  }
  removeAllListeners: (channel: string) => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}