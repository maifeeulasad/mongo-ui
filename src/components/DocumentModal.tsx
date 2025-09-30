import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon, 
  DocumentIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/utils'

interface DocumentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (document: any) => void
  document: any
  mode: 'create' | 'edit' | 'view'
  collectionName: string
}

export default function DocumentModal({
  isOpen,
  onClose,
  onSave,
  document,
  mode,
  collectionName
}: DocumentModalProps) {
  const { isDarkMode } = useAppStore()
  const [jsonContent, setJsonContent] = useState('')
  const [error, setError] = useState('')
  const [isValidJson, setIsValidJson] = useState(true)

  useEffect(() => {
    if (isOpen) {
      if (document && mode !== 'create') {
        setJsonContent(JSON.stringify(document, null, 2))
      } else {
        setJsonContent('{\n  \n}')
      }
      setError('')
      setIsValidJson(true)
    }
  }, [isOpen, document, mode])

  const validateJson = (content: string) => {
    try {
      JSON.parse(content)
      setIsValidJson(true)
      setError('')
      return true
    } catch (err) {
      setIsValidJson(false)
      setError(err instanceof Error ? err.message : 'Invalid JSON')
      return false
    }
  }

  const handleContentChange = (content: string) => {
    setJsonContent(content)
    validateJson(content)
  }

  const handleSave = () => {
    if (!isValidJson) {
      setError('Please fix JSON syntax errors before saving')
      return
    }

    try {
      const parsedDocument = JSON.parse(jsonContent)
      onSave(parsedDocument)
    } catch (err) {
      setError('Failed to parse JSON document')
    }
  }

  const getTitle = () => {
    switch (mode) {
      case 'create':
        return `Create Document in ${collectionName}`
      case 'edit':
        return `Edit Document in ${collectionName}`
      case 'view':
        return `View Document in ${collectionName}`
      default:
        return 'Document'
    }
  }

  const isReadOnly = mode === 'view'

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
                'relative w-full max-w-4xl max-h-[80vh] rounded-lg shadow-xl',
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              )}
            >
              {/* Header */}
              <div className={cn(
                'flex items-center justify-between p-6 border-b',
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              )}>
                <div className="flex items-center space-x-3">
                  <DocumentIcon className={cn(
                    'h-6 w-6',
                    mode === 'create' ? 'text-green-600' :
                    mode === 'edit' ? 'text-blue-600' : 'text-gray-600'
                  )} />
                  <h2 className={cn(
                    'text-lg font-semibold',
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  )}>
                    {getTitle()}
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
                {/* JSON Editor */}
                <div className="mb-4">
                  <label className={cn(
                    'block text-sm font-medium mb-2',
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  )}>
                    Document JSON
                  </label>
                  <div className="relative">
                    <textarea
                      value={jsonContent}
                      onChange={(e) => handleContentChange(e.target.value)}
                      readOnly={isReadOnly}
                      className={cn(
                        'w-full h-96 p-4 font-mono text-sm border rounded-lg resize-none',
                        !isValidJson && 'border-red-500',
                        isReadOnly && 'bg-gray-50 dark:bg-gray-700',
                        isDarkMode
                          ? 'bg-gray-900 border-gray-600 text-gray-100 placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      )}
                      placeholder="Enter JSON document..."
                      spellCheck={false}
                    />
                    
                    {/* Line numbers (simple implementation) */}
                    <div className={cn(
                      'absolute left-0 top-0 bottom-0 w-12 p-4 text-xs pointer-events-none',
                      isDarkMode ? 'text-gray-500' : 'text-gray-400'
                    )}>
                      {jsonContent.split('\n').map((_, index) => (
                        <div key={index} className="leading-5">
                          {index + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  >
                    <div className="flex items-start space-x-2">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-800 dark:text-red-200">
                          JSON Error
                        </p>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                          {error}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Help Text */}
                {mode === 'create' && (
                  <div className={cn(
                    'mb-4 p-3 rounded-lg border',
                    isDarkMode 
                      ? 'bg-blue-900/20 border-blue-800 text-blue-200'
                      : 'bg-blue-50 border-blue-200 text-blue-800'
                  )}>
                    <p className="text-sm">
                      <strong>Tip:</strong> Enter a valid JSON object. The _id field will be automatically generated if not provided.
                    </p>
                  </div>
                )}

                {mode === 'edit' && (
                  <div className={cn(
                    'mb-4 p-3 rounded-lg border',
                    isDarkMode 
                      ? 'bg-yellow-900/20 border-yellow-800 text-yellow-200'
                      : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                  )}>
                    <p className="text-sm">
                      <strong>Warning:</strong> Modifying the _id field may cause issues. It&apos;s recommended to keep the original _id value.
                    </p>
                  </div>
                )}
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
                  {isReadOnly ? 'Close' : 'Cancel'}
                </button>
                
                {!isReadOnly && (
                  <button
                    onClick={handleSave}
                    disabled={!isValidJson}
                    className={cn(
                      'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                      !isValidJson
                        ? 'opacity-50 cursor-not-allowed bg-gray-400'
                        : mode === 'create'
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                    )}
                  >
                    {mode === 'create' ? 'Create Document' : 'Save Changes'}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}