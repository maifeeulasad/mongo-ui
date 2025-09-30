import { 
  Bars3Icon, 
  MoonIcon, 
  SunIcon,
  Cog6ToothIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import { useElectron } from '@/hooks/useElectron'
import { cn } from '@/utils'

export default function Header() {
  const { 
    toggleSidebar, 
    toggleDarkMode, 
    isDarkMode, 
    activeConnection,
    isLoading 
  } = useAppStore()
  
  const { isElectron, getAppVersion } = useElectron()

  const handleAbout = async () => {
    if (isElectron) {
      const version = await getAppVersion()
      alert(`MongoDB UI v${version}`)
    } else {
      alert('MongoDB UI - Web Version')
    }
  }

  return (
    <header className={cn(
      'flex h-14 items-center justify-between border-b px-4',
      isDarkMode 
        ? 'border-gray-700 bg-gray-800' 
        : 'border-gray-200 bg-white'
    )}>
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className={cn(
            'rounded-lg p-2 transition-colors',
            isDarkMode
              ? 'hover:bg-gray-700 text-gray-300'
              : 'hover:bg-gray-100 text-gray-600'
          )}
        >
          <Bars3Icon className="h-5 w-5" />
        </button>

        {/* Connection Status */}
        {activeConnection && (
          <div className="flex items-center space-x-2">
            <div className={cn(
              'h-2 w-2 rounded-full',
              activeConnection.isConnected 
                ? 'bg-green-500' 
                : 'bg-red-500'
            )} />
            <span className={cn(
              'text-sm font-medium',
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            )}>
              {activeConnection.name}
            </span>
            {isLoading && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className={cn(
                  'h-4 w-4 border-2 border-current border-t-transparent rounded-full',
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                )}
              />
            )}
          </div>
        )}
      </div>

      {/* Center - Title */}
      <div className="flex-1 text-center">
        <h1 className={cn(
          'text-lg font-semibold',
          isDarkMode ? 'text-white' : 'text-gray-900'
        )}>
          MongoDB UI
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        {/* Settings */}
        <button
          className={cn(
            'rounded-lg p-2 transition-colors',
            isDarkMode
              ? 'hover:bg-gray-700 text-gray-300'
              : 'hover:bg-gray-100 text-gray-600'
          )}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className={cn(
            'rounded-lg p-2 transition-colors',
            isDarkMode
              ? 'hover:bg-gray-700 text-gray-300'
              : 'hover:bg-gray-100 text-gray-600'
          )}
        >
          {isDarkMode ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </button>

        {/* About */}
        <button
          onClick={handleAbout}
          className={cn(
            'rounded-lg p-2 transition-colors',
            isDarkMode
              ? 'hover:bg-gray-700 text-gray-300'
              : 'hover:bg-gray-100 text-gray-600'
          )}
        >
          <InformationCircleIcon className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}