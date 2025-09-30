import { MongoClient, Db } from 'mongodb'

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

export interface MongoConnection {
  client: MongoClient
  db?: Db
  isConnected: boolean
}

class MongoDBService {
  private connections: Map<string, MongoConnection> = new Map()

  async connect(connection: Connection): Promise<{ success: boolean; error?: string }> {
    try {
      const connectionString = this.buildConnectionString(connection)
      
      const client = new MongoClient(connectionString, {
        maxPoolSize: 10,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 10000,
        serverSelectionTimeoutMS: 10000,
      })

      await client.connect()
      
      // Test the connection
      await client.db('admin').admin().ping()

      this.connections.set(connection.id, {
        client,
        db: connection.database ? client.db(connection.database) : undefined,
        isConnected: true,
      })

      return { success: true }
    } catch (error) {
      console.error('MongoDB connection error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown connection error' 
      }
    }
  }

  async disconnect(connectionId: string): Promise<void> {
    const connection = this.connections.get(connectionId)
    if (connection) {
      await connection.client.close()
      this.connections.delete(connectionId)
    }
  }

  async testConnection(connection: Connection): Promise<{ success: boolean; error?: string }> {
    try {
      const connectionString = this.buildConnectionString(connection)
      
      const client = new MongoClient(connectionString, {
        connectTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000,
      })

      await client.connect()
      await client.db('admin').admin().ping()
      await client.close()

      return { success: true }
    } catch (error) {
      console.error('MongoDB test connection error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Connection test failed' 
      }
    }
  }

  async listDatabases(connectionId: string): Promise<string[]> {
    const connection = this.connections.get(connectionId)
    if (!connection || !connection.isConnected) {
      throw new Error('No active connection found')
    }

    const result = await connection.client.db('admin').admin().listDatabases()
    return result.databases.map(db => db.name)
  }

  async listCollections(connectionId: string, databaseName: string): Promise<string[]> {
    const connection = this.connections.get(connectionId)
    if (!connection || !connection.isConnected) {
      throw new Error('No active connection found')
    }

    const db = connection.client.db(databaseName)
    const collections = await db.listCollections().toArray()
    return collections.map(col => col.name)
  }

  getConnection(connectionId: string): MongoConnection | undefined {
    return this.connections.get(connectionId)
  }

  isConnected(connectionId: string): boolean {
    const connection = this.connections.get(connectionId)
    return connection?.isConnected ?? false
  }

  private buildConnectionString(connection: Connection): string {
    if (connection.connectionString) {
      return connection.connectionString
    }

    let connectionString = 'mongodb://'
    
    if (connection.username && connection.password) {
      connectionString += `${encodeURIComponent(connection.username)}:${encodeURIComponent(connection.password)}@`
    }
    
    connectionString += `${connection.host}:${connection.port}`
    
    if (connection.database) {
      connectionString += `/${connection.database}`
    }
    
    const options: string[] = []
    
    if (connection.authDatabase && connection.authDatabase !== 'admin') {
      options.push(`authSource=${connection.authDatabase}`)
    }
    
    if (connection.ssl) {
      options.push('ssl=true')
    }
    
    if (options.length > 0) {
      connectionString += `?${options.join('&')}`
    }
    
    return connectionString
  }
}

export const mongoDBService = new MongoDBService()