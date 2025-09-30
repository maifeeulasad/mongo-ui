import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  CircleStackIcon, 
  DocumentIcon, 
  TableCellsIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/utils'

export default function DatabasePage() {
  const { databaseName } = useParams<{
    connectionId: string
    databaseName: string
  }>()
  
  const { isDarkMode } = useAppStore()

  // Mock data - in a real app, this would come from the database
  const collections = [
    { name: 'users', documents: 1250, size: '2.3 MB', indexes: 3 },
    { name: 'products', documents: 850, size: '1.8 MB', indexes: 2 },
    { name: 'orders', documents: 3420, size: '5.1 MB', indexes: 4 },
    { name: 'categories', documents: 25, size: '12 KB', indexes: 1 },
  ]

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <CircleStackIcon className={cn(
              'h-6 w-6',
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            )} />
            <h1 className={cn(
              'text-2xl font-bold',
              isDarkMode ? 'text-white' : 'text-gray-900'
            )}>
              {databaseName}
            </h1>
          </div>
          <p className={cn(
            'text-sm',
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          )}>
            Database collections and statistics
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={cn(
              'card',
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            )}
          >
            <div className="flex items-center">
              <div className={cn(
                'p-3 rounded-lg mr-4',
                isDarkMode ? 'bg-gray-700' : 'bg-blue-100'
              )}>
                <TableCellsIcon className={cn(
                  'h-6 w-6',
                  isDarkMode ? 'text-gray-300' : 'text-blue-600'
                )} />
              </div>
              <div>
                <p className={cn(
                  'text-sm font-medium',
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                )}>
                  Collections
                </p>
                <p className={cn(
                  'text-2xl font-bold',
                  isDarkMode ? 'text-white' : 'text-gray-900'
                )}>
                  {collections.length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={cn(
              'card',
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            )}
          >
            <div className="flex items-center">
              <div className={cn(
                'p-3 rounded-lg mr-4',
                isDarkMode ? 'bg-gray-700' : 'bg-green-100'
              )}>
                <DocumentIcon className={cn(
                  'h-6 w-6',
                  isDarkMode ? 'text-gray-300' : 'text-green-600'
                )} />
              </div>
              <div>
                <p className={cn(
                  'text-sm font-medium',
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                )}>
                  Documents
                </p>
                <p className={cn(
                  'text-2xl font-bold',
                  isDarkMode ? 'text-white' : 'text-gray-900'
                )}>
                  {collections.reduce((sum, col) => sum + col.documents, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={cn(
              'card',
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            )}
          >
            <div className="flex items-center">
              <div className={cn(
                'p-3 rounded-lg mr-4',
                isDarkMode ? 'bg-gray-700' : 'bg-purple-100'
              )}>
                <ChartBarIcon className={cn(
                  'h-6 w-6',
                  isDarkMode ? 'text-gray-300' : 'text-purple-600'
                )} />
              </div>
              <div>
                <p className={cn(
                  'text-sm font-medium',
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                )}>
                  Total Size
                </p>
                <p className={cn(
                  'text-2xl font-bold',
                  isDarkMode ? 'text-white' : 'text-gray-900'
                )}>
                  9.2 MB
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={cn(
              'card',
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            )}
          >
            <div className="flex items-center">
              <div className={cn(
                'p-3 rounded-lg mr-4',
                isDarkMode ? 'bg-gray-700' : 'bg-orange-100'
              )}>
                <CircleStackIcon className={cn(
                  'h-6 w-6',
                  isDarkMode ? 'text-gray-300' : 'text-orange-600'
                )} />
              </div>
              <div>
                <p className={cn(
                  'text-sm font-medium',
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                )}>
                  Indexes
                </p>
                <p className={cn(
                  'text-2xl font-bold',
                  isDarkMode ? 'text-white' : 'text-gray-900'
                )}>
                  {collections.reduce((sum, col) => sum + col.indexes, 0)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Collections Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className={cn(
            'card overflow-hidden',
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          )}
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className={cn(
              'text-lg font-semibold',
              isDarkMode ? 'text-white' : 'text-gray-900'
            )}>
              Collections
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={cn(
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              )}>
                <tr>
                  <th className={cn(
                    'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider',
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  )}>
                    Name
                  </th>
                  <th className={cn(
                    'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider',
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  )}>
                    Documents
                  </th>
                  <th className={cn(
                    'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider',
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  )}>
                    Size
                  </th>
                  <th className={cn(
                    'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider',
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  )}>
                    Indexes
                  </th>
                  <th className={cn(
                    'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider',
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
                {collections.map((collection, index) => (
                  <motion.tr
                    key={collection.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className={cn(
                      'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer'
                    )}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <TableCellsIcon className={cn(
                          'h-5 w-5 mr-3',
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        )} />
                        <span className={cn(
                          'text-sm font-medium',
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        )}>
                          {collection.name}
                        </span>
                      </div>
                    </td>
                    <td className={cn(
                      'px-6 py-4 whitespace-nowrap text-sm',
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    )}>
                      {collection.documents.toLocaleString()}
                    </td>
                    <td className={cn(
                      'px-6 py-4 whitespace-nowrap text-sm',
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    )}>
                      {collection.size}
                    </td>
                    <td className={cn(
                      'px-6 py-4 whitespace-nowrap text-sm',
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    )}>
                      {collection.indexes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900 mr-4">
                        Browse
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        Query
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}