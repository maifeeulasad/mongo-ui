import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HomeIcon,
  ServerIcon,
  PlusIcon,
  TrashIcon,
  WifiIcon,
  NoSymbolIcon,
  CircleStackIcon
} from '@heroicons/react/24/outline'
import { useAppStore } from '@/store/appStore'
import { useMongoDB } from '@/hooks/useMongoDB'
import { cn } from '@/utils'
import ConnectionModal from '@/components/ConnectionModal'
import { DatabaseTreeItem } from './DatabaseTreeItem'

export default function Sidebar() {
  const location = useLocation()
  const { 
    connections, 
    activeConnection, 
    setActiveConnection, 
    removeConnection,
    databases,
    selectedDatabase,
    isDarkMode 
  } = useAppStore()
  
  const { connectToMongoDB, disconnectFromMongoDB, checkConnectionStatus } = useMongoDB()
  const [showConnectionModal, setShowConnectionModal] = useState(false)

  // Check connection status on mount
  useEffect(() => {
    const checkAllConnections = async () => {
      for (const connection of connections) {
        if (connection.isConnected) {
          const isStillConnected = await checkConnectionStatus(connection.id)
          if (!isStillConnected) {
            // Update connection status if it's no longer connected
            setActiveConnection({ ...connection, isConnected: false })
          }
        }
      }
    }
    
    checkAllConnections()
  }, [connections, checkConnectionStatus, setActiveConnection])

  const handleConnect = async (connection: any) => {
    const success = await connectToMongoDB(connection)
    if (success) {
      setActiveConnection({
        ...connection,
        isConnected: true,
        lastConnected: new Date()
      })
    }
  }

  const handleDisconnect = async (connection: any) => {
    await disconnectFromMongoDB(connection.id)
    setActiveConnection({
      ...connection,
      isConnected: false
    })
  }

  const handleRemoveConnection = (e: React.MouseEvent, connectionId: string) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to remove this connection?')) {
      removeConnection(connectionId)
    }
  }

  const navigationItems = [
    {
      name: 'Home',
      href: '/',
      icon: HomeIcon,
    },
    {
      name: 'Connections',
      href: '/connections',
      icon: ServerIcon,
    },
    {
      name: 'Browser',
      href: '/browser',
      icon: CircleStackIcon,
    },
  ]

  return (
    <div className={cn(
      'flex h-full w-70 flex-col',
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
    )}>
      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href
            
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? isDarkMode
                        ? 'bg-primary-600 text-white'
                        : 'bg-primary-100 text-primary-900'
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Connections Section */}
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className={cn(
            'text-sm font-semibold',
            isDarkMode ? 'text-gray-200' : 'text-gray-900'
          )}>
            Connections
          </h3>
          <button
            onClick={() => setShowConnectionModal(true)}
            className={cn(
              'rounded p-1 transition-colors',
              isDarkMode
                ? 'hover:bg-gray-700 text-gray-400'
                : 'hover:bg-gray-200 text-gray-600'
            )}
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2">
          <AnimatePresence>
            {connections.map((connection) => (
              <motion.div
                key={connection.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  'group flex items-center justify-between rounded-lg p-3 cursor-pointer transition-colors',
                  activeConnection?.id === connection.id
                    ? isDarkMode
                      ? 'bg-gray-700'
                      : 'bg-gray-200'
                    : isDarkMode
                      ? 'hover:bg-gray-700'
                      : 'hover:bg-gray-100'
                )}
                onClick={() => {
                  if (connection.isConnected) {
                    handleDisconnect(connection)
                  } else {
                    handleConnect(connection)
                  }
                }}
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  {connection.isConnected ? (
                    <WifiIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <NoSymbolIcon className="h-4 w-4 text-red-500 flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className={cn(
                      'text-sm font-medium truncate',
                      isDarkMode ? 'text-gray-200' : 'text-gray-900'
                    )}>
                      {connection.name}
                    </p>
                    <p className={cn(
                      'text-xs truncate',
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    )}>
                      {connection.host}:{connection.port}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => handleRemoveConnection(e, connection.id)}
                  className={cn(
                    'opacity-0 group-hover:opacity-100 rounded p-1 transition-all',
                    isDarkMode
                      ? 'hover:bg-red-600 text-gray-400 hover:text-white'
                      : 'hover:bg-red-100 text-gray-600 hover:text-red-600'
                  )}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {connections.length === 0 && (
            <div className={cn(
              'text-center py-8',
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            )}>
              <ServerIcon className="mx-auto h-12 w-12 mb-4" />
              <p className="text-sm">No connections yet</p>
              <button
                onClick={() => setShowConnectionModal(true)}
                className="mt-2 text-sm text-primary-600 hover:text-primary-500"
              >
                Add your first connection
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Database Tree Section */}
      {activeConnection?.isConnected && (
        <div className="flex-1 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className={cn(
              'text-sm font-semibold',
              isDarkMode ? 'text-gray-200' : 'text-gray-900'
            )}>
              Databases
            </h3>
            <span className={cn(
              'text-xs px-2 py-1 rounded-full',
              isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
            )}>
              {databases.length}
            </span>
          </div>

          <div className="space-y-1 max-h-96 overflow-y-auto">
            {databases.length === 0 ? (
              <div className={cn(
                'text-center py-4',
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              )}>
                <p className="text-sm">No databases found</p>
              </div>
            ) : (
              databases.map((database) => (
                <DatabaseTreeItem
                  key={database}
                  connectionId={activeConnection.id}
                  databaseName={database}
                  isSelected={selectedDatabase === database}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Connection Modal */}
      <ConnectionModal
        isOpen={showConnectionModal}
        onClose={() => setShowConnectionModal(false)}
      />
    </div>
  )
}