import { useAppStore } from '@/store/appStore'
import { cn } from '@/utils'

export default function ConnectionDebug() {
  const { 
    activeConnection, 
    databases, 
    connections,
    isDarkMode 
  } = useAppStore()

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className={cn(
      'fixed bottom-4 right-4 p-3 rounded-lg border text-xs max-w-sm',
      isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'bg-white border-gray-300 text-gray-700'
    )}>
      <h4 className="font-semibold mb-2">Debug Info</h4>
      <div className="space-y-1">
        <p>Connections: {connections.length}</p>
        <p>Active Connection: {activeConnection ? activeConnection.name : 'None'}</p>
        <p>Active Connection ID: {activeConnection?.id || 'None'}</p>
        <p>Is Connected: {activeConnection?.isConnected ? 'Yes' : 'No'}</p>
        <p>Databases: {databases.length}</p>
        <p>Database List: {databases.join(', ') || 'None'}</p>
      </div>
    </div>
  )
}