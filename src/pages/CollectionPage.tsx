import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TableCellsIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { useAppStore } from '@/store/appStore'
import { useMongoDB } from '@/hooks/useMongoDB'
import { cn } from '@/utils'
import DocumentModal from '@/components/DocumentModal'
import DeleteConfirmModal from '@/components/DeleteConfirmModal'

interface Document {
  _id: string
  [key: string]: any
}

export default function CollectionPage() {
  const { connectionId, databaseName, collectionName } = useParams<{
    connectionId: string
    databaseName: string
    collectionName: string
  }>()
  
  const navigate = useNavigate()
  const { activeConnection, isDarkMode, setLoading, setError } = useAppStore()
  const { getDocuments, insertDocument, updateDocument, deleteDocument } = useMongoDB()
  
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('view')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalDocuments, setTotalDocuments] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const documentsPerPage = 20
  const totalPages = Math.ceil(totalDocuments / documentsPerPage)

  useEffect(() => {
    if (connectionId && databaseName && collectionName) {
      loadDocuments()
    }
  }, [connectionId, databaseName, collectionName, currentPage, searchQuery])

  const loadDocuments = async () => {
    if (!connectionId || !databaseName || !collectionName) return
    
    setIsRefreshing(true)
    setError(null)
    
    try {
      const result = await getDocuments(
        connectionId, 
        databaseName, 
        collectionName,
        {
          page: currentPage,
          limit: documentsPerPage,
          search: searchQuery
        }
      )
      
      setDocuments(result.documents)
      setTotalDocuments(result.total)
    } catch (error) {
      console.error('Failed to load documents:', error)
      setError('Failed to load documents')
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleCreateDocument = () => {
    setSelectedDocument(null)
    setModalMode('create')
    setShowDocumentModal(true)
  }

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document)
    setModalMode('view')
    setShowDocumentModal(true)
  }

  const handleEditDocument = (document: Document) => {
    setSelectedDocument(document)
    setModalMode('edit')
    setShowDocumentModal(true)
  }

  const handleDeleteDocument = (document: Document) => {
    setDocumentToDelete(document)
    setShowDeleteModal(true)
  }

  const handleSaveDocument = async (documentData: any) => {
    if (!connectionId || !databaseName || !collectionName) return
    
    setLoading(true)
    try {
      if (modalMode === 'create') {
        await insertDocument(connectionId, databaseName, collectionName, documentData)
      } else if (modalMode === 'edit' && selectedDocument) {
        await updateDocument(connectionId, databaseName, collectionName, selectedDocument._id, documentData)
      }
      
      setShowDocumentModal(false)
      setSelectedDocument(null)
      await loadDocuments()
    } catch (error) {
      console.error('Failed to save document:', error)
      setError('Failed to save document')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!connectionId || !databaseName || !collectionName || !documentToDelete) return
    
    setLoading(true)
    try {
      await deleteDocument(connectionId, databaseName, collectionName, documentToDelete._id)
      setShowDeleteModal(false)
      setDocumentToDelete(null)
      await loadDocuments()
    } catch (error) {
      console.error('Failed to delete document:', error)
      setError('Failed to delete document')
    } finally {
      setLoading(false)
    }
  }

  const formatValue = (value: any): string => {
    if (value === null) return 'null'
    if (value === undefined) return 'undefined'
    if (typeof value === 'object') return JSON.stringify(value, null, 2)
    if (typeof value === 'string') return `"${value}"`
    return String(value)
  }

  const getDocumentKeys = (): string[] => {
    const keys = new Set<string>()
    documents.forEach(doc => {
      Object.keys(doc).forEach(key => keys.add(key))
    })
    return Array.from(keys).slice(0, 5) // Show first 5 columns
  }

  if (!activeConnection?.isConnected) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <TableCellsIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className={cn(
            'text-lg font-medium mb-2',
            isDarkMode ? 'text-white' : 'text-gray-900'
          )}>
            No Active Connection
          </h3>
          <p className={cn(
            'text-sm',
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          )}>
            Please connect to a MongoDB instance first
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                )}
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              
              <div>
                <div className="flex items-center space-x-2">
                  <TableCellsIcon className="h-6 w-6 text-green-600" />
                  <h1 className={cn(
                    'text-2xl font-bold',
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  )}>
                    {collectionName}
                  </h1>
                </div>
                <p className={cn(
                  'text-sm mt-1',
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {databaseName} • {totalDocuments} documents
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={loadDocuments}
                disabled={isRefreshing}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  isRefreshing 
                    ? 'opacity-50 cursor-not-allowed'
                    : isDarkMode
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                )}
              >
                <ArrowPathIcon className={cn('h-5 w-5', isRefreshing && 'animate-spin')} />
              </button>
              
              <button
                onClick={handleCreateDocument}
                className="btn-primary flex items-center space-x-2"
              >
                <PlusIcon className="h-4 w-4" />
                <span>New Document</span>
              </button>
            </div>
          </div>
          
          {/* Search */}
          <div className="mt-4">
            <div className="relative max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  'w-full pl-10 pr-4 py-2 border rounded-lg text-sm',
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {documents.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <TableCellsIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className={cn(
                'text-lg font-medium mb-2',
                isDarkMode ? 'text-white' : 'text-gray-900'
              )}>
                {searchQuery ? 'No matching documents' : 'No documents found'}
              </h3>
              <p className={cn(
                'text-sm mb-4',
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              )}>
                {searchQuery 
                  ? 'Try adjusting your search criteria'
                  : 'This collection is empty. Create your first document to get started.'
                }
              </p>
              {!searchQuery && (
                <button
                  onClick={handleCreateDocument}
                  className="btn-primary"
                >
                  Create Document
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6">
            {/* Documents Table */}
            <div className={cn(
              'overflow-x-auto rounded-lg border',
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            )}>
              <table className="w-full">
                <thead className={cn(
                  'border-b',
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                )}>
                  <tr>
                    {getDocumentKeys().map((key) => (
                      <th
                        key={key}
                        className={cn(
                          'px-4 py-3 text-left text-xs font-medium uppercase tracking-wider',
                          isDarkMode ? 'text-gray-300' : 'text-gray-500'
                        )}
                      >
                        {key}
                      </th>
                    ))}
                    <th className={cn(
                      'px-4 py-3 text-right text-xs font-medium uppercase tracking-wider',
                      isDarkMode ? 'text-gray-300' : 'text-gray-500'
                    )}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={cn(
                  'divide-y',
                  isDarkMode 
                    ? 'bg-gray-800 divide-gray-700' 
                    : 'bg-white divide-gray-200'
                )}>
                  <AnimatePresence>
                    {documents.map((document, index) => (
                      <motion.tr
                        key={document._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                        )}
                      >
                        {getDocumentKeys().map((key) => (
                          <td
                            key={key}
                            className={cn(
                              'px-4 py-3 text-sm',
                              isDarkMode ? 'text-gray-300' : 'text-gray-900'
                            )}
                          >
                            <div className="max-w-xs truncate">
                              {formatValue(document[key])}
                            </div>
                          </td>
                        ))}
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleViewDocument(document)}
                              className={cn(
                                'p-1 rounded transition-colors',
                                isDarkMode
                                  ? 'hover:bg-gray-600 text-gray-400 hover:text-white'
                                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                              )}
                              title="View"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEditDocument(document)}
                              className={cn(
                                'p-1 rounded transition-colors',
                                isDarkMode
                                  ? 'hover:bg-gray-600 text-gray-400 hover:text-white'
                                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                              )}
                              title="Edit"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDocument(document)}
                              className={cn(
                                'p-1 rounded transition-colors',
                                isDarkMode
                                  ? 'hover:bg-red-600 text-gray-400 hover:text-white'
                                  : 'hover:bg-red-100 text-gray-600 hover:text-red-600'
                              )}
                              title="Delete"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className={cn(
                  'text-sm',
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                )}>
                  Showing {((currentPage - 1) * documentsPerPage) + 1} to {Math.min(currentPage * documentsPerPage, totalDocuments)} of {totalDocuments} documents
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={cn(
                      'px-3 py-1 rounded border text-sm transition-colors',
                      currentPage === 1
                        ? 'opacity-50 cursor-not-allowed'
                        : isDarkMode
                          ? 'border-gray-600 hover:bg-gray-700'
                          : 'border-gray-300 hover:bg-gray-50',
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    )}
                  >
                    Previous
                  </button>
                  
                  <span className={cn(
                    'px-3 py-1 text-sm',
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  )}>
                    {currentPage} of {totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className={cn(
                      'px-3 py-1 rounded border text-sm transition-colors',
                      currentPage === totalPages
                        ? 'opacity-50 cursor-not-allowed'
                        : isDarkMode
                          ? 'border-gray-600 hover:bg-gray-700'
                          : 'border-gray-300 hover:bg-gray-50',
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    )}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <DocumentModal
        isOpen={showDocumentModal}
        onClose={() => setShowDocumentModal(false)}
        onSave={handleSaveDocument}
        document={selectedDocument}
        mode={modalMode}
        collectionName={collectionName || ''}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Document"
        message={`Are you sure you want to delete this document? This action cannot be undone.`}
      />
    </div>
  )
}