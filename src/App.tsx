import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '@/components/Layout'
import HomePage from '@/pages/HomePage'
import ConnectionsPage from '@/pages/ConnectionsPage'
import DatabasePage from '@/pages/DatabasePage'
import { useAppStore } from '@/store/appStore'

function App() {
  const { isDarkMode, initialize } = useAppStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    // Handle system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        document.documentElement.classList.toggle('dark', e.matches)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <Layout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route 
              path="/" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <HomePage />
                </motion.div>
              } 
            />
            <Route 
              path="/connections" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ConnectionsPage />
                </motion.div>
              } 
            />
            <Route 
              path="/database/:connectionId/:databaseName" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <DatabasePage />
                </motion.div>
              } 
            />
          </Routes>
        </AnimatePresence>
      </Layout>
    </div>
  )
}

export default App