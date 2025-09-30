import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CircleStackIcon,
  TableCellsIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { useAppStore } from '@/store/appStore'
import { useMongoDB } from '@/hooks/useMongoDB'
import { cn } from '@/utils'

export default function DatabasePage() {
  const { 
    activeConnection, 
    selectedDatabase, 
    collections,
    isDarkMode 
  } = useAppStore()
  
  const { listCollections } = useMongoDB()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (activeConnection?.isConnected && selectedDatabase && collections.length === 0) {
      loadCollections()
    }
  }, [activeConnection, selectedDatabase])

  const loadCollections = async () => {
    if (!activeConnection || !selectedDatabase) return
    
    setIsLoading(true)
    try {
      await listCollections(activeConnection.id, selectedDatabase)
    } catch (error) {
      console.error('Failed to load collections:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!activeConnection?.isConnected) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <CircleStackIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
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
            Connect to a MongoDB instance to browse databases
          </p>
        </div>
      </div>
    )
  }

  if (!selectedDatabase) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <CircleStackIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className={cn(
            'text-lg font-medium mb-2',
            isDarkMode ? 'text-white' : 'text-gray-900'
          )}>
            Select a Database
          </h3>
          <p className={cn(
            'text-sm',
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          )}>
            Choose a database from the sidebar to view its collections
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <CircleStackIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className={cn(
                'text-2xl font-bold',
                isDarkMode ? 'text-white' : 'text-gray-900'
              )}>
                {selectedDatabase}
              </h1>
              <p className={cn(
                'text-sm',
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              )}>
                Connected to {activeConnection.name}
              </p>
            </div>
          </div>
        </div>

        {/* Collections */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className={cn(
              'text-lg font-semibold',
              isDarkMode ? 'text-white' : 'text-gray-900'
            )}>
              Collections
            </h2>
            <span className={cn(
              'text-sm px-3 py-1 rounded-full',
              isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            )}>
              {collections.length} collections
            </span>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : collections.length === 0 ? (
            <div className={cn(
              'text-center py-8 border-2 border-dashed rounded-lg',
              isDarkMode ? 'border-gray-700' : 'border-gray-300'
            )}>
              <TableCellsIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className={cn(
                'text-sm font-medium mb-2',
                isDarkMode ? 'text-gray-300' : 'text-gray-900'
              )}>
                No collections found
              </p>
              <p className={cn(
                'text-sm',
                isDarkMode ? 'text-gray-500' : 'text-gray-600'
              )}>
                This database doesn&apos;t contain any collections yet
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {collections.map((collection, index) => (
                <motion.div
                  key={collection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    'p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md',
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  )}
                  onClick={() => {
                    // TODO: Navigate to collection view
                    console.log('Selected collection:', collection)
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <TableCellsIcon className="h-6 w-6 text-green-600 mt-1" />
                    <div className="flex-1 min-w-0">
                      <h3 className={cn(
                        'text-sm font-medium truncate',
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      )}>
                        {collection}
                      </h3>
                      <p className={cn(
                        'text-xs mt-1',
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      )}>
                        Click to browse documents
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Database Stats */}
        <div className="mb-8">
          <h2 className={cn(
            'text-lg font-semibold mb-4',
            isDarkMode ? 'text-white' : 'text-gray-900'
          )}>
            Database Statistics
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className={cn(
              'p-4 rounded-lg border',
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            )}>
              <div className="flex items-center space-x-3">
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
                <div>
                  <p className={cn(
                    'text-2xl font-bold',
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  )}>
                    {collections.length}
                  </p>
                  <p className={cn(
                    'text-sm',
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    Collections
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}