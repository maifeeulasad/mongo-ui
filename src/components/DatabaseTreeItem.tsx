import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronRightIcon, 
  ChevronDownIcon,
  CircleStackIcon,
  TableCellsIcon,
  FolderIcon,
  FolderOpenIcon
} from '@heroicons/react/24/outline'
import { useAppStore } from '@/store/appStore'
import { useMongoDB } from '@/hooks/useMongoDB'

interface DatabaseTreeItemProps {
  connectionId: string
  databaseName: string
  isSelected: boolean
}

export function DatabaseTreeItem({ connectionId, databaseName, isSelected }: DatabaseTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(isSelected)
  const [collections, setCollections] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const { selectedDatabase, setSelectedDatabase } = useAppStore()
  const { selectDatabase, listCollections } = useMongoDB()

  const handleToggle = async () => {
    if (!isExpanded && collections.length === 0) {
      setIsLoading(true)
      try {
        const cols = await listCollections(connectionId, databaseName)
        setCollections(cols)
      } catch (error) {
        console.error('Failed to load collections:', error)
      } finally {
        setIsLoading(false)
      }
    }
    setIsExpanded(!isExpanded)
  }

  const handleSelect = async () => {
    setSelectedDatabase(databaseName)
    await selectDatabase(connectionId, databaseName)
    if (!isExpanded) {
      await handleToggle()
    }
  }

  return (
    <div className="select-none">
      {/* Database Item */}
      <div
        className={`
          flex items-center px-2 py-1 rounded-md cursor-pointer group
          ${isSelected 
            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }
        `}
        onClick={handleSelect}
      >
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleToggle()
          }}
          className="flex items-center justify-center w-4 h-4 mr-1"
        >
          {isLoading ? (
            <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : isExpanded ? (
            <ChevronDownIcon className="w-3 h-3" />
          ) : (
            <ChevronRightIcon className="w-3 h-3" />
          )}
        </button>
        
        {isExpanded ? (
          <FolderOpenIcon className="w-4 h-4 mr-2 text-yellow-600" />
        ) : (
          <FolderIcon className="w-4 h-4 mr-2 text-yellow-600" />
        )}
        
        <span className="text-sm font-medium truncate flex-1">{databaseName}</span>
        
        <CircleStackIcon className="w-3 h-3 opacity-60" />
      </div>

      {/* Collections */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-4 overflow-hidden"
          >
            {collections.length === 0 && !isLoading ? (
              <div className="px-6 py-1 text-xs text-gray-500 italic">
                No collections
              </div>
            ) : (
              collections.map((collection) => (
                <CollectionItem 
                  key={collection} 
                  name={collection} 
                  connectionId={connectionId}
                  databaseName={databaseName}
                />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface CollectionItemProps {
  name: string
  connectionId: string
  databaseName: string
}

function CollectionItem({ name, connectionId, databaseName }: CollectionItemProps) {
  const [isSelected, setIsSelected] = useState(false)

  const handleSelect = () => {
    setIsSelected(!isSelected)
    // TODO: Navigate to collection view or update selected collection state
    console.log('Selected collection:', { connectionId, databaseName, collection: name })
  }

  return (
    <div
      className={`
        flex items-center px-2 py-1 ml-4 rounded-md cursor-pointer group
        ${isSelected 
          ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        }
      `}
      onClick={handleSelect}
    >
      <TableCellsIcon className="w-4 h-4 mr-2 text-green-600" />
      <span className="text-sm truncate flex-1">{name}</span>
    </div>
  )
}