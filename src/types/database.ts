export interface Connection {
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

export interface Database {
  name: string
  sizeOnDisk: number
  empty: boolean
  collections: Collection[]
}

export interface Collection {
  name: string
  type: string
  size: number
  count: number
  avgObjSize: number
  indexes: Index[]
}

export interface Index {
  name: string
  key: Record<string, any>
  unique: boolean
  sparse: boolean
  size: number
}

export interface Document {
  _id: string | number | object
  [key: string]: any
}

export interface QueryResult {
  documents: Document[]
  totalCount: number
  hasMore: boolean
  executionTime: number
}

export interface ConnectionStatus {
  isConnecting: boolean
  isConnected: boolean
  error?: string
  lastPing?: Date
}