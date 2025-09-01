import React from 'react'

const JournalEntry = ({ entry, onClick, compact = false, dayNumber }) => {
  if (compact) {
    return (
      <div 
        className="journal-entry-compact cursor-pointer hover:shadow-sm transition-all duration-150"
        onClick={onClick}
      >
        {/* Rating stars overlaid on image */}
        <div className="relative mb-1">
          <img 
            src={entry.imgUrl} 
            alt="Journal entry"
            className="w-full h-12 sm:h-16 object-cover rounded"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyOEMyNi4yMDkxIDI4IDI4IDI2LjIwOTEgMjggMjRDMjggMjEuNzkwOSAyNi4yMDkxIDIwIDI0IDIwQzIxLjc5MDkgMjAgMjAgMjEuNzkwOSAyMCAyNEMyMCAyNi4yMDkxIDIxLjc5MDkgMjggMjQgMjhaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xMiA0MEgzNkM0MC40MTgyIDQwIDQ0IDM2LjQxODIgNDQgMzJWMThDNDQgMTMuNTgxOCA0MC40MTgyIDEwIDM2IDEwSDEyQzcuNTgxNzIgMTAgNCAxMy41ODE4IDQgMThWMzJDNCAzNi40MTgyIDcuNTgxNzIgNDAgMTIgNDBaIiBzdHJva2U9IiM5QjlCQTAiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K'
            }}
          />
          {/* Stars overlaid on top of image */}
          <div className="absolute top-0.5 left-0.5 sm:top-1 sm:left-1 flex items-center space-x-0.5">
            {[...Array(5)].map((_, i) => (
              <span 
                key={i} 
                className={`text-xs ${i < Math.floor(entry.rating) ? 'text-blue-400' : 'text-gray-300'}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        
        {/* Categories/badges */}
        <div className="flex justify-center space-x-0.5 sm:space-x-1 mb-1">
          {entry.categories.slice(0, 2).map((category, index) => {
            const colors = ['bg-purple-500', 'bg-pink-500', 'bg-blue-500', 'bg-green-500']
            const color = colors[index % colors.length]
            return (
              <span 
                key={index}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
                style={{ backgroundColor: index === 0 ? '#8b5cf6' : '#ec4899' }}
              >
                {category.charAt(0).toUpperCase()}
              </span>
            )
          })}
        </div>
        
        {/* Entry count at bottom */}
        <div className="text-center text-xs text-gray-700">
          {entry.rating}
        </div>
      </div>
    )
  }

  return (
    <div 
      className="journal-entry"
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        <img 
          src={entry.imgUrl} 
          alt="Journal entry"
          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyOEMyNi4yMDkxIDI4IDI4IDI2LjIwOTEgMjggMjRDMjggMjEuNzkwOSAyNi4yMDkxIDIwIDI0IDIwQzIxLjc5MDkgMjAgMjAgMjEuNzkwOSAyMCAyNEMyMCAyNi4yMDkxIDIxLjc5MDkgMjggMjQgMjhaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xMiA0MEgzNkM0MC40MTgyIDQwIDQ0IDM2LjQxODIgNDQgMzJWMThDNDQgMTMuNTgxOCA0MC40MTgyIDEwIDM2IDEwSDEyQzcuNTgxNzIgMTAgNCAxMy41ODE4IDQgMThWMzJDNCAzNi40MTgyIDcuNTgxNzIgNDAgMTIgNDBaIiBzdHJva2U9IiM5QjlCQTAiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K'
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="text-sm font-medium text-gray-900 truncate">
              {entry.description.substring(0, 50)}...
            </div>
            <div className="flex items-center space-x-1 ml-2">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i} 
                  className={`text-sm ${i < Math.floor(entry.rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                >
                  ★
                </span>
              ))}
              <span className="text-sm text-gray-600 font-medium ml-1">
                {entry.rating}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {entry.categories.slice(0, 3).map((category, index) => (
              <span 
                key={index}
                className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
              >
                {category}
              </span>
            ))}
            {entry.categories.length > 3 && (
              <span className="text-xs text-gray-500">
                +{entry.categories.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default JournalEntry
