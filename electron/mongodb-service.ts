import { MongoClient, Db, ObjectId } from 'mongodb'

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

  async getDocuments(connectionId: string, databaseName: string, collectionName: string, options: {
    page?: number
    limit?: number
    search?: string
    filter?: any
  } = {}): Promise<{ documents: any[], total: number }> {
    const connection = this.connections.get(connectionId)
    if (!connection || !connection.isConnected) {
      throw new Error('No active connection found')
    }

    const db = connection.client.db(databaseName)
    const collection = db.collection(collectionName)
    
    let query = options.filter || {}
    
    // Add search functionality (simple text search)
    if (options.search && options.search.trim()) {
      const searchTerm = options.search.trim()
      
      // Try text search first
      try {
        const textSearchQuery = { $text: { $search: searchTerm } }
        const testResult = await collection.findOne(textSearchQuery)
        if (testResult) {
          query = textSearchQuery
        } else {
          throw new Error('No text index')
        }
      } catch {
        // Fallback to regex search on common string fields
        const sampleDoc = await collection.findOne({})
        if (sampleDoc) {
          const stringFields = Object.keys(sampleDoc).filter(key => 
            typeof sampleDoc[key] === 'string' && key !== '_id'
          )
          
          if (stringFields.length > 0) {
            query = {
              $or: stringFields.map(field => ({
                [field]: { $regex: searchTerm, $options: 'i' }
              }))
            }
          }
        }
      }
    }

    const page = options.page || 1
    const limit = options.limit || 20
    const skip = (page - 1) * limit

    const [documents, total] = await Promise.all([
      collection.find(query).skip(skip).limit(limit).toArray(),
      collection.countDocuments(query)
    ])

    return {
      documents: documents.map(doc => ({
        ...doc,
        _id: doc._id.toString()
      })),
      total
    }
  }

  async insertDocument(connectionId: string, databaseName: string, collectionName: string, document: any): Promise<string> {
    const connection = this.connections.get(connectionId)
    if (!connection || !connection.isConnected) {
      throw new Error('No active connection found')
    }

    const db = connection.client.db(databaseName)
    const collection = db.collection(collectionName)
    
    const result = await collection.insertOne(document)
    return result.insertedId.toString()
  }

  async updateDocument(connectionId: string, databaseName: string, collectionName: string, documentId: string, document: any): Promise<void> {
    const connection = this.connections.get(connectionId)
    if (!connection || !connection.isConnected) {
      throw new Error('No active connection found')
    }

    const db = connection.client.db(databaseName)
    const collection = db.collection(collectionName)
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...updateDoc } = document
    
    // Try to parse as ObjectId, fallback to string
    let query: any
    try {
      query = { _id: new ObjectId(documentId) }
    } catch {
      query = { _id: documentId }
    }
    
    await collection.updateOne(query, { $set: updateDoc })
  }

  async deleteDocument(connectionId: string, databaseName: string, collectionName: string, documentId: string): Promise<void> {
    const connection = this.connections.get(connectionId)
    if (!connection || !connection.isConnected) {
      throw new Error('No active connection found')
    }

    const db = connection.client.db(databaseName)
    const collection = db.collection(collectionName)
    
    // Try to parse as ObjectId, fallback to string
    let query: any
    try {
      query = { _id: new ObjectId(documentId) }
    } catch {
      query = { _id: documentId }
    }
    
    await collection.deleteOne(query)
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