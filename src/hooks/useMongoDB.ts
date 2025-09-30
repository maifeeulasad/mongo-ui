import { useCallback } from 'react'
import { useAppStore } from '@/store/appStore'
import type { Connection } from '@/types'

export function useMongoDB() {
  const { 
    setError, 
    setLoading, 
    updateConnection, 
    setActiveConnection,
    setDatabases,
    setSelectedDatabase,
    setCollections
  } = useAppStore()

  const connectToMongoDB = useCallback(async (connection: Connection) => {
    if (!window.electronAPI?.mongodb) {
      setError('MongoDB functionality is only available in the desktop app')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const result = await window.electronAPI.mongodb.connect(connection)
      
      if (result.success) {
        // Update the connection status in the store
        const updatedConnection = { 
          ...connection,
          isConnected: true, 
          lastConnected: new Date() 
        }
        
        updateConnection(connection.id, { 
          isConnected: true, 
          lastConnected: new Date() 
        })
        
        setActiveConnection(updatedConnection)
        
        // Automatically load databases after successful connection
        try {
          const databases = await window.electronAPI.mongodb.listDatabases(connection.id)
          setDatabases(databases)
          console.log('Connected and loaded databases:', databases.length)
        } catch (dbError) {
          console.error('Failed to load databases after connection:', dbError)
          // Still set as connected even if database loading fails
        }
        
        return true
      } else {
        setError(result.error || 'Failed to connect to MongoDB')
        updateConnection(connection.id, { isConnected: false })
        return false
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setError(errorMessage)
      updateConnection(connection.id, { isConnected: false })
      return false
    } finally {
      setLoading(false)
    }
  }, [setError, setLoading, updateConnection, setActiveConnection, setDatabases])

  const disconnectFromMongoDB = useCallback(async (connectionId: string) => {
    if (!window.electronAPI?.mongodb) {
      setError('MongoDB functionality is only available in the desktop app')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await window.electronAPI.mongodb.disconnect(connectionId)
      updateConnection(connectionId, { isConnected: false })
      setActiveConnection(null)
      setDatabases([])
      setSelectedDatabase(null)
      setCollections([])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to disconnect'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [setError, setLoading, updateConnection, setActiveConnection, setDatabases, setSelectedDatabase, setCollections])

  const testConnection = useCallback(async (connection: Connection) => {
    if (!window.electronAPI?.mongodb) {
      setError('MongoDB functionality is only available in the desktop app')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const result = await window.electronAPI.mongodb.testConnection(connection)
      
      if (!result.success) {
        setError(result.error || 'Connection test failed')
      }
      
      return result.success
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection test failed'
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }, [setError, setLoading])

  const checkConnectionStatus = useCallback(async (connectionId: string) => {
    if (!window.electronAPI?.mongodb) {
      return false
    }

    try {
      return await window.electronAPI.mongodb.isConnected(connectionId)
    } catch (error) {
      console.error('Failed to check connection status:', error)
      return false
    }
  }, [])

  const listDatabases = useCallback(async (connectionId: string) => {
    if (!window.electronAPI?.mongodb) {
      setError('MongoDB functionality is only available in the desktop app')
      return []
    }

    setLoading(true)
    setError(null)

    try {
      return await window.electronAPI.mongodb.listDatabases(connectionId)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to list databases'
      setError(errorMessage)
      return []
    } finally {
      setLoading(false)
    }
  }, [setError, setLoading])

  const listCollections = useCallback(async (connectionId: string, databaseName: string) => {
    if (!window.electronAPI?.mongodb) {
      setError('MongoDB functionality is only available in the desktop app')
      return []
    }

    setLoading(true)
    setError(null)

    try {
      return await window.electronAPI.mongodb.listCollections(connectionId, databaseName)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to list collections'
      setError(errorMessage)
      return []
    } finally {
      setLoading(false)
    }
  }, [setError, setLoading])

  const selectDatabase = useCallback(async (connectionId: string, databaseName: string) => {
    if (!window.electronAPI?.mongodb) {
      setError('MongoDB functionality is only available in the desktop app')
      return []
    }

    setLoading(true)
    setError(null)

    try {
      setSelectedDatabase(databaseName)
      const collections = await window.electronAPI.mongodb.listCollections(connectionId, databaseName)
      setCollections(collections)
      return collections
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load collections'
      setError(errorMessage)
      setSelectedDatabase(null)
      setCollections([])
      return []
    } finally {
      setLoading(false)
    }
  }, [setError, setLoading, setSelectedDatabase, setCollections])

  const getDocuments = useCallback(async (
    connectionId: string, 
    databaseName: string, 
    collectionName: string,
    options?: {
      page?: number
      limit?: number
      search?: string
      filter?: any
    }
  ) => {
    if (!window.electronAPI?.mongodb) {
      setError('MongoDB functionality is only available in the desktop app')
      return { documents: [], total: 0 }
    }

    setLoading(true)
    setError(null)

    try {
      return await window.electronAPI.mongodb.getDocuments(connectionId, databaseName, collectionName, options)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load documents'
      setError(errorMessage)
      return { documents: [], total: 0 }
    } finally {
      setLoading(false)
    }
  }, [setError, setLoading])

  const insertDocument = useCallback(async (
    connectionId: string,
    databaseName: string,
    collectionName: string,
    document: any
  ) => {
    if (!window.electronAPI?.mongodb) {
      setError('MongoDB functionality is only available in the desktop app')
      return ''
    }

    setLoading(true)
    setError(null)

    try {
      return await window.electronAPI.mongodb.insertDocument(connectionId, databaseName, collectionName, document)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to insert document'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }, [setError, setLoading])

  const updateDocument = useCallback(async (
    connectionId: string,
    databaseName: string,
    collectionName: string,
    documentId: string,
    document: any
  ) => {
    if (!window.electronAPI?.mongodb) {
      setError('MongoDB functionality is only available in the desktop app')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await window.electronAPI.mongodb.updateDocument(connectionId, databaseName, collectionName, documentId, document)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update document'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }, [setError, setLoading])

  const deleteDocument = useCallback(async (
    connectionId: string,
    databaseName: string,
    collectionName: string,
    documentId: string
  ) => {
    if (!window.electronAPI?.mongodb) {
      setError('MongoDB functionality is only available in the desktop app')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await window.electronAPI.mongodb.deleteDocument(connectionId, databaseName, collectionName, documentId)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete document'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }, [setError, setLoading])

  return {
    connectToMongoDB,
    disconnectFromMongoDB,
    testConnection,
    checkConnectionStatus,
    listDatabases,
    listCollections,
    selectDatabase,
    getDocuments,
    insertDocument,
    updateDocument,
    deleteDocument,
    isElectronAvailable: !!window.electronAPI?.mongodb,
  }
}