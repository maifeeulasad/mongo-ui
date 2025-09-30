import { motion } from 'framer-motion'
import { 
  CircleStackIcon, 
  TableCellsIcon,
  WifiIcon,
  PlayIcon
} from '@heroicons/react/24/outline'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/utils'

export default function DatabaseBrowserPage() {
  const { 
    activeConnection, 
    selectedDatabase, 
    collections,
    databases,
    isDarkMode 
  } = useAppStore()

  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <CircleStackIcon className="mx-auto h-16 w-16 text-blue-600 mb-4" />
            <h1 className={cn(
              'text-3xl font-bold mb-4',
              isDarkMode ? 'text-white' : 'text-gray-900'
            )}>
              Database Browser
            </h1>
            <p className={cn(
              'text-lg max-w-2xl mx-auto',
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            )}>
              Browse and manage your MongoDB databases and collections
            </p>
          </div>

          {/* Connection Status */}
          <div className={cn(
            'mb-8 p-6 rounded-lg border',
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          )}>
            <div className="flex items-center space-x-3 mb-4">
              <WifiIcon className={cn(
                'h-6 w-6',
                activeConnection?.isConnected ? 'text-green-500' : 'text-red-500'
              )} />
              <h2 className={cn(
                'text-lg font-semibold',
                isDarkMode ? 'text-white' : 'text-gray-900'
              )}>
                Connection Status
              </h2>
            </div>
            
            {activeConnection?.isConnected ? (
              <div>
                <p className={cn(
                  'text-sm mb-2',
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  ✅ Connected to <strong>{activeConnection.name}</strong>
                </p>
                <p className={cn(
                  'text-sm',
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {activeConnection.host}:{activeConnection.port}
                </p>
              </div>
            ) : (
              <p className={cn(
                'text-sm',
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              )}>
                No active connection. Please connect to a MongoDB instance first.
              </p>
            )}
          </div>

          {/* Database Info */}
          {activeConnection?.isConnected && (
            <div className={cn(
              'mb-8 p-6 rounded-lg border',
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            )}>
              <div className="flex items-center space-x-3 mb-4">
                <CircleStackIcon className="h-6 w-6 text-blue-600" />
                <h2 className={cn(
                  'text-lg font-semibold',
                  isDarkMode ? 'text-white' : 'text-gray-900'
                )}>
                  Databases
                </h2>
                <span className={cn(
                  'text-sm px-2 py-1 rounded-full',
                  isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                )}>
                  {databases.length} databases
                </span>
              </div>
              
              {databases.length > 0 ? (
                <div className="space-y-2">
                  {databases.map((database) => (
                    <div
                      key={database}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-md',
                        selectedDatabase === database
                          ? isDarkMode
                            ? 'bg-blue-900/30 border border-blue-600'
                            : 'bg-blue-50 border border-blue-200'
                          : isDarkMode
                            ? 'bg-gray-700'
                            : 'bg-gray-50'
                      )}
                    >
                      <span className={cn(
                        'font-medium',
                        selectedDatabase === database
                          ? 'text-blue-600'
                          : isDarkMode ? 'text-gray-200' : 'text-gray-900'
                      )}>
                        {database}
                      </span>
                      {selectedDatabase === database && (
                        <PlayIcon className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className={cn(
                  'text-sm',
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                )}>
                  No databases found.
                </p>
              )}
            </div>
          )}

          {/* Collections Info */}
          {selectedDatabase && (
            <div className={cn(
              'mb-8 p-6 rounded-lg border',
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            )}>
              <div className="flex items-center space-x-3 mb-4">
                <TableCellsIcon className="h-6 w-6 text-green-600" />
                <h2 className={cn(
                  'text-lg font-semibold',
                  isDarkMode ? 'text-white' : 'text-gray-900'
                )}>
                  Collections in &quot;{selectedDatabase}&quot;
                </h2>
                <span className={cn(
                  'text-sm px-2 py-1 rounded-full',
                  isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                )}>
                  {collections.length} collections
                </span>
              </div>
              
              {collections.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {collections.map((collection) => (
                    <div
                      key={collection}
                      className={cn(
                        'p-3 rounded-md border cursor-pointer transition-colors',
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      )}
                    >
                      <div className="flex items-center space-x-2">
                        <TableCellsIcon className="h-4 w-4 text-green-600" />
                        <span className={cn(
                          'text-sm font-medium',
                          isDarkMode ? 'text-gray-200' : 'text-gray-900'
                        )}>
                          {collection}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={cn(
                  'text-sm',
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                )}>
                  No collections found in this database.
                </p>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className={cn(
            'p-6 rounded-lg border',
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          )}>
            <h2 className={cn(
              'text-lg font-semibold mb-4',
              isDarkMode ? 'text-white' : 'text-gray-900'
            )}>
              How to Use Database Browser
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <p className={cn(isDarkMode ? 'text-gray-300' : 'text-gray-700')}>
                  <strong>Connect:</strong> Create a connection and click on it in the sidebar to connect to your MongoDB instance.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <p className={cn(isDarkMode ? 'text-gray-300' : 'text-gray-700')}>
                  <strong>Browse:</strong> Once connected, databases will appear in the sidebar. Click on a database to expand and view its collections.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <p className={cn(isDarkMode ? 'text-gray-300' : 'text-gray-700')}>
                  <strong>Explore:</strong> Click on collections to view their documents and manage your data.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}