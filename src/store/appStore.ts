import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { Connection, AppSettings } from '@/types'

interface AppState {
  // Theme and settings
  isDarkMode: boolean
  settings: AppSettings
  
  // Connections
  connections: Connection[]
  activeConnection: Connection | null
  
  // UI state
  sidebarOpen: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  initialize: () => void
  toggleDarkMode: () => void
  updateSettings: (settings: Partial<AppSettings>) => void
  addConnection: (connection: Omit<Connection, 'id' | 'createdAt' | 'isConnected'>) => void
  updateConnection: (id: string, updates: Partial<Connection>) => void
  removeConnection: (id: string) => void
  setActiveConnection: (connection: Connection | null) => void
  toggleSidebar: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        isDarkMode: false,
        settings: {
          theme: 'system',
          language: 'en',
          autoConnect: false,
          queryTimeout: 30000,
          pageSize: 50,
        },
        connections: [],
        activeConnection: null,
        sidebarOpen: true,
        isLoading: false,
        error: null,

        // Actions
        initialize: () => {
          const { settings } = get()
          
          // Set initial theme based on settings
          if (settings.theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            set({ isDarkMode: prefersDark })
          } else {
            set({ isDarkMode: settings.theme === 'dark' })
          }
        },

        toggleDarkMode: () => {
          const { isDarkMode, settings } = get()
          const newDarkMode = !isDarkMode
          
          set({ 
            isDarkMode: newDarkMode,
            settings: {
              ...settings,
              theme: newDarkMode ? 'dark' : 'light'
            }
          })
        },

        updateSettings: (newSettings) => {
          const { settings } = get()
          const updatedSettings = { ...settings, ...newSettings }
          
          set({ settings: updatedSettings })
          
          // Update theme if changed
          if (newSettings.theme) {
            if (newSettings.theme === 'system') {
              const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
              set({ isDarkMode: prefersDark })
            } else {
              set({ isDarkMode: newSettings.theme === 'dark' })
            }
          }
        },

        addConnection: (connectionData) => {
          const { connections } = get()
          const newConnection: Connection = {
            ...connectionData,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            isConnected: false,
          }
          
          set({ connections: [...connections, newConnection] })
        },

        updateConnection: (id, updates) => {
          const { connections } = get()
          set({
            connections: connections.map(conn =>
              conn.id === id ? { ...conn, ...updates } : conn
            )
          })
        },

        removeConnection: (id) => {
          const { connections, activeConnection } = get()
          const updatedConnections = connections.filter(conn => conn.id !== id)
          
          set({
            connections: updatedConnections,
            activeConnection: activeConnection?.id === id ? null : activeConnection
          })
        },

        setActiveConnection: (connection) => {
          set({ activeConnection: connection })
        },

        toggleSidebar: () => {
          const { sidebarOpen } = get()
          set({ sidebarOpen: !sidebarOpen })
        },

        setLoading: (loading) => {
          set({ isLoading: loading })
        },

        setError: (error) => {
          set({ error })
        },
      }),
      {
        name: 'mongo-ui-storage',
        partialize: (state) => ({
          settings: state.settings,
          connections: state.connections,
          isDarkMode: state.isDarkMode,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    { name: 'AppStore' }
  )
)