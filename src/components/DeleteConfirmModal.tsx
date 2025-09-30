import { motion, AnimatePresence } from 'framer-motion'
import { 
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/utils'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel'
}: DeleteConfirmModalProps) {
  const { isDarkMode } = useAppStore()

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                'relative w-full max-w-md rounded-lg shadow-xl',
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              )}
            >
              {/* Header */}
              <div className={cn(
                'flex items-center justify-between p-6 border-b',
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              )}>
                <div className="flex items-center space-x-3">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                  <h2 className={cn(
                    'text-lg font-semibold',
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  )}>
                    {title}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    isDarkMode
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  )}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className={cn(
                  'text-sm',
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  {message}
                </p>
              </div>

              {/* Footer */}
              <div className={cn(
                'flex items-center justify-end space-x-3 p-6 border-t',
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              )}>
                <button
                  onClick={onClose}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-lg border transition-colors',
                    isDarkMode
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  )}
                >
                  {cancelText}
                </button>
                
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}