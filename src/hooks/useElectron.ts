import { useEffect } from 'react'
import { useAppStore } from '@/store/appStore'

export function useElectron() {
  const setError = useAppStore(state => state.setError)

  useEffect(() => {
    // Check if we're running in Electron
    if (window.electronAPI) {
      // Listen for menu events
      window.electronAPI.onMenuNewConnection(() => {
        // Handle new connection menu item
        console.log('New connection requested from menu')
      })

      return () => {
        window.electronAPI?.removeAllListeners('menu-new-connection')
      }
    }
  }, [])

  const showDialog = async (options: any) => {
    if (window.electronAPI) {
      try {
        return await window.electronAPI.showMessageBox(options)
      } catch (error) {
        setError('Failed to show dialog')
        return null
      }
    }
    return null
  }

  const getAppVersion = async () => {
    if (window.electronAPI) {
      try {
        return await window.electronAPI.getVersion()
      } catch (error) {
        setError('Failed to get app version')
        return null
      }
    }
    return null
  }

  const getPlatform = async () => {
    if (window.electronAPI) {
      try {
        return await window.electronAPI.getPlatform()
      } catch (error) {
        setError('Failed to get platform')
        return null
      }
    }
    return null
  }

  return {
    isElectron: !!window.electronAPI,
    showDialog,
    getAppVersion,
    getPlatform,
  }
}