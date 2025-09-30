import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  WifiIcon,
  NoSymbolIcon 
} from '@heroicons/react/24/outline'
import { useAppStore } from '@/store/appStore'
import { useMongoDB } from '@/hooks/useMongoDB'
import { cn, formatDate } from '@/utils'
import ConnectionModal from '@/components/ConnectionModal'

export default function ConnectionsPage() {
  const { 
    connections, 
    activeConnection, 
    setActiveConnection, 
    removeConnection,
    isDarkMode 
  } = useAppStore()
  
  const { connectToMongoDB, disconnectFromMongoDB, testConnection } = useMongoDB()
  const [showConnectionModal, setShowConnectionModal] = useState(false)

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

  const handleDisconnect = async () => {
    if (activeConnection) {
      await disconnectFromMongoDB(activeConnection.id)
      setActiveConnection({
        ...activeConnection,
        isConnected: false
      })
    }
  }

  const handleTestConnection = async (connection: any) => {
    const success = await testConnection(connection)
    if (success) {
      alert('Connection test successful!')
    }
    // Error handling is done in the useMongoDB hook
  }

  const handleRemoveConnection = (connectionId: string) => {
    if (confirm('Are you sure you want to remove this connection?')) {
      removeConnection(connectionId)
    }
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={cn(
              'text-2xl font-bold',
              isDarkMode ? 'text-white' : 'text-gray-900'
            )}>
              Connections
            </h1>
            <p className={cn(
              'text-sm mt-1',
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            )}>
              Manage your MongoDB connections
            </p>
          </div>
          <button
            onClick={() => setShowConnectionModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>New Connection</span>
          </button>
        </div>

        {/* Connections Grid */}
        {connections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connections.map((connection, index) => (
              <motion.div
                key={connection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={cn(
                  'card relative group',
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
                  activeConnection?.id === connection.id && 'ring-2 ring-primary-500'
                )}
              >
                {/* Connection Status */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {connection.isConnected ? (
                      <WifiIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <NoSymbolIcon className="h-5 w-5 text-red-500" />
                    )}
                    <span className={cn(
                      'text-sm font-medium',
                      connection.isConnected ? 'text-green-600' : 'text-red-600'
                    )}>
                      {connection.isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className={cn(
                        'p-1 rounded transition-colors',
                        isDarkMode
                          ? 'hover:bg-gray-700 text-gray-400'
                          : 'hover:bg-gray-100 text-gray-600'
                      )}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveConnection(connection.id)}
                      className={cn(
                        'p-1 rounded transition-colors',
                        isDarkMode
                          ? 'hover:bg-red-600 text-gray-400 hover:text-white'
                          : 'hover:bg-red-100 text-gray-600 hover:text-red-600'
                      )}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Connection Info */}
                <div className="mb-4">
                  <h3 className={cn(
                    'font-semibold text-lg mb-2',
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  )}>
                    {connection.name}
                  </h3>
                  <div className={cn(
                    'text-sm space-y-1',
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    <p><span className="font-medium">Host:</span> {connection.host}</p>
                    <p><span className="font-medium">Port:</span> {connection.port}</p>
                    {connection.database && (
                      <p><span className="font-medium">Database:</span> {connection.database}</p>
                    )}
                    {connection.username && (
                      <p><span className="font-medium">Username:</span> {connection.username}</p>
                    )}
                    {connection.lastConnected && (
                      <p><span className="font-medium">Last Connected:</span> {formatDate(connection.lastConnected)}</p>
                    )}
                  </div>
                </div>

                {/* Connection Actions */}
                <div className="flex space-x-2">
                  {connection.isConnected ? (
                    <button
                      onClick={handleDisconnect}
                      className="flex-1 btn-outline"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnect(connection)}
                      className="flex-1 btn-primary"
                    >
                      Connect
                    </button>
                  )}
                  <button
                    onClick={() => handleTestConnection(connection)}
                    className="btn-outline"
                  >
                    Test
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
              'text-center py-12',
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            )}
          >
            <WifiIcon className="mx-auto h-16 w-16 mb-4" />
            <h3 className={cn(
              'text-lg font-semibold mb-2',
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            )}>
              No connections yet
            </h3>
            <p className="mb-6">
              Create your first MongoDB connection to get started
            </p>
            <button
              onClick={() => setShowConnectionModal(true)}
              className="btn-primary"
            >
              Create Connection
            </button>
          </motion.div>
        )}

        {/* Connection Modal */}
        <ConnectionModal
          isOpen={showConnectionModal}
          onClose={() => setShowConnectionModal(false)}
        />
      </motion.div>
    </div>
  )
}