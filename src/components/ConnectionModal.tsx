import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/utils'

interface ConnectionModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ConnectionModal({ isOpen, onClose }: ConnectionModalProps) {
  const { addConnection, isDarkMode } = useAppStore()
  
  const [formData, setFormData] = useState({
    name: '',
    host: 'localhost',
    port: 27017,
    database: '',
    username: '',
    password: '',
    ssl: false,
    authDatabase: 'admin',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.host) {
      alert('Name and host are required')
      return
    }

    addConnection(formData)
    setFormData({
      name: '',
      host: 'localhost',
      port: 27017,
      database: '',
      username: '',
      password: '',
      ssl: false,
      authDatabase: 'admin',
    })
    onClose()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          as="div"
          className="relative z-50"
          onClose={onClose}
          open={isOpen}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50"
          />

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'w-full max-w-md transform overflow-hidden rounded-lg p-6 text-left align-middle shadow-xl transition-all',
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                )}
              >
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title
                    as="h3"
                    className={cn(
                      'text-lg font-medium',
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    )}
                  >
                    New Connection
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className={cn(
                      'rounded-lg p-1 transition-colors',
                      isDarkMode
                        ? 'hover:bg-gray-700 text-gray-400'
                        : 'hover:bg-gray-100 text-gray-600'
                    )}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className={cn(
                      'block text-sm font-medium mb-1',
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    )}>
                      Connection Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={cn(
                        'input',
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900'
                      )}
                      placeholder="My MongoDB Connection"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={cn(
                        'block text-sm font-medium mb-1',
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      )}>
                        Host *
                      </label>
                      <input
                        type="text"
                        name="host"
                        value={formData.host}
                        onChange={handleChange}
                        required
                        className={cn(
                          'input',
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        )}
                      />
                    </div>
                    <div>
                      <label className={cn(
                        'block text-sm font-medium mb-1',
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      )}>
                        Port
                      </label>
                      <input
                        type="number"
                        name="port"
                        value={formData.port}
                        onChange={handleChange}
                        className={cn(
                          'input',
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={cn(
                      'block text-sm font-medium mb-1',
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    )}>
                      Database
                    </label>
                    <input
                      type="text"
                      name="database"
                      value={formData.database}
                      onChange={handleChange}
                      className={cn(
                        'input',
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900'
                      )}
                      placeholder="Optional"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={cn(
                        'block text-sm font-medium mb-1',
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      )}>
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={cn(
                          'input',
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900'
                        )}
                        placeholder="Optional"
                      />
                    </div>
                    <div>
                      <label className={cn(
                        'block text-sm font-medium mb-1',
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      )}>
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={cn(
                          'input',
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900'
                        )}
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={cn(
                      'block text-sm font-medium mb-1',
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    )}>
                      Auth Database
                    </label>
                    <input
                      type="text"
                      name="authDatabase"
                      value={formData.authDatabase}
                      onChange={handleChange}
                      className={cn(
                        'input',
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      )}
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="ssl"
                      id="ssl"
                      checked={formData.ssl}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label 
                      htmlFor="ssl"
                      className={cn(
                        'ml-2 text-sm',
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      )}
                    >
                      Use SSL
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      Connect
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  )
}