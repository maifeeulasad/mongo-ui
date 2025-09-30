import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Header from './Header'
import ConnectionDebug from './ConnectionDebug'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/utils'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { sidebarOpen, isDarkMode } = useAppStore()

  return (
    <div className={cn(
      'flex h-screen overflow-hidden',
      isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    )}>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarOpen ? 280 : 0,
          opacity: sidebarOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="relative flex-shrink-0 overflow-hidden"
      >
        <div className="sidebar w-70">
          <Sidebar />
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        
        {/* Debug panel - remove this later */}
        <ConnectionDebug />
        
        <main className="main-content flex-1 overflow-auto">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}