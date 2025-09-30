import { motion } from 'framer-motion'
import { 
  ServerIcon, 
  CircleStackIcon, 
  DocumentIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/utils'

export default function HomePage() {
  const { connections, activeConnection, isDarkMode } = useAppStore()

  const stats = [
    {
      name: 'Total Connections',
      value: connections.length,
      icon: ServerIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Active Connection',
      value: activeConnection ? '1' : '0',
      icon: CircleStackIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Databases',
      value: '-',
      icon: DocumentIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Collections',
      value: '-',
      icon: ChartBarIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className={cn(
            'text-3xl font-bold mb-2',
            isDarkMode ? 'text-white' : 'text-gray-900'
          )}>
            Welcome to MongoDB UI
          </h1>
          <p className={cn(
            'text-lg',
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          )}>
            A modern interface for managing your MongoDB databases
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                'card flex items-center',
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              )}
            >
              <div className={cn(
                'p-3 rounded-lg mr-4',
                isDarkMode ? 'bg-gray-700' : stat.bgColor
              )}>
                <stat.icon className={cn(
                  'h-6 w-6',
                  isDarkMode ? 'text-gray-300' : stat.color
                )} />
              </div>
              <div>
                <p className={cn(
                  'text-sm font-medium',
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {stat.name}
                </p>
                <p className={cn(
                  'text-2xl font-bold',
                  isDarkMode ? 'text-white' : 'text-gray-900'
                )}>
                  {stat.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity / Getting Started */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Getting Started */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={cn(
              'card',
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            )}
          >
            <h3 className={cn(
              'text-lg font-semibold mb-4',
              isDarkMode ? 'text-white' : 'text-gray-900'
            )}>
              Getting Started
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold text-sm">1</span>
                </div>
                <span className={cn(
                  'text-sm',
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Create your first MongoDB connection
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-semibold text-sm">2</span>
                </div>
                <span className={cn(
                  'text-sm',
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Browse databases and collections
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-semibold text-sm">3</span>
                </div>
                <span className={cn(
                  'text-sm',
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Query and manage your data
                </span>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className={cn(
              'card',
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            )}
          >
            <h3 className={cn(
              'text-lg font-semibold mb-4',
              isDarkMode ? 'text-white' : 'text-gray-900'
            )}>
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full btn-primary text-left">
                + New Connection
              </button>
              <button className="w-full btn-outline text-left" disabled>
                Import Data
              </button>
              <button className="w-full btn-outline text-left" disabled>
                Export Data
              </button>
            </div>
          </motion.div>
        </div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className={cn(
            'card mt-6',
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          )}
        >
          <h3 className={cn(
            'text-lg font-semibold mb-4',
            isDarkMode ? 'text-white' : 'text-gray-900'
          )}>
            Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <CircleStackIcon className={cn(
                'h-12 w-12 mx-auto mb-3',
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              )} />
              <h4 className={cn(
                'font-semibold mb-2',
                isDarkMode ? 'text-white' : 'text-gray-900'
              )}>
                Database Management
              </h4>
              <p className={cn(
                'text-sm',
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              )}>
                Browse, create, and manage databases and collections with ease
              </p>
            </div>
            <div className="text-center">
              <DocumentIcon className={cn(
                'h-12 w-12 mx-auto mb-3',
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              )} />
              <h4 className={cn(
                'font-semibold mb-2',
                isDarkMode ? 'text-white' : 'text-gray-900'
              )}>
                Document Editor
              </h4>
              <p className={cn(
                'text-sm',
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              )}>
                View, edit, and create documents with a powerful JSON editor
              </p>
            </div>
            <div className="text-center">
              <ChartBarIcon className={cn(
                'h-12 w-12 mx-auto mb-3',
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              )} />
              <h4 className={cn(
                'font-semibold mb-2',
                isDarkMode ? 'text-white' : 'text-gray-900'
              )}>
                Query Builder
              </h4>
              <p className={cn(
                'text-sm',
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              )}>
                Build complex queries with our intuitive visual query builder
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}