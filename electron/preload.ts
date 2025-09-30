import { contextBridge, ipcRenderer } from 'electron'

// Connection interface for the preload context
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

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getVersion: () => ipcRenderer.invoke('app-version'),
  getPlatform: () => ipcRenderer.invoke('platform'),
  
  // Dialog
  showMessageBox: (options: Electron.MessageBoxOptions) => 
    ipcRenderer.invoke('show-message-box', options),
  
  // Menu events
  onMenuNewConnection: (callback: () => void) => 
    ipcRenderer.on('menu-new-connection', callback),
  
  // MongoDB operations
  mongodb: {
    connect: (connection: Connection) => 
      ipcRenderer.invoke('mongodb-connect', connection),
    disconnect: (connectionId: string) => 
      ipcRenderer.invoke('mongodb-disconnect', connectionId),
    testConnection: (connection: Connection) => 
      ipcRenderer.invoke('mongodb-test-connection', connection),
    listDatabases: (connectionId: string) => 
      ipcRenderer.invoke('mongodb-list-databases', connectionId),
    listCollections: (connectionId: string, databaseName: string) => 
      ipcRenderer.invoke('mongodb-list-collections', connectionId, databaseName),
    getDocuments: (connectionId: string, databaseName: string, collectionName: string, options?: any) => 
      ipcRenderer.invoke('mongodb-get-documents', connectionId, databaseName, collectionName, options),
    insertDocument: (connectionId: string, databaseName: string, collectionName: string, document: any) => 
      ipcRenderer.invoke('mongodb-insert-document', connectionId, databaseName, collectionName, document),
    updateDocument: (connectionId: string, databaseName: string, collectionName: string, documentId: string, document: any) => 
      ipcRenderer.invoke('mongodb-update-document', connectionId, databaseName, collectionName, documentId, document),
    deleteDocument: (connectionId: string, databaseName: string, collectionName: string, documentId: string) => 
      ipcRenderer.invoke('mongodb-delete-document', connectionId, databaseName, collectionName, documentId),
    isConnected: (connectionId: string) => 
      ipcRenderer.invoke('mongodb-is-connected', connectionId),
  },
  
  // Remove listeners
  removeAllListeners: (channel: string) => 
    ipcRenderer.removeAllListeners(channel),
})

// Types for the exposed API
export interface ElectronAPI {
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