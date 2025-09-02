import React from 'react'

const JournalEntry = ({ entry, onClick, compact = false, dayNumber }) => {
  const getCategoryEmoji = (category) => {
    const categoryMap = {
      'Deep Conditioning': '💧',
      'Moisture': '💦',
      'Hair Growth': '🌱',
      'Natural Products': '🌿',
      'Protein Treatment': '💪',
      'Hair Repair': '🔧',
      'Salon Visit': '💇‍♀️',
      'Protective Style': '🛡️',
      'Braids': '🪢',
      'Scalp Care': '🧴',
      'Wash Day': '🧼',
      'Detangling': '🪮',
      'Leave-in Conditioner': '💦',
      'Hair Oil': '🫒',
      'Scalp Massage': '💆‍♀️',
      'Growth': '📈',
      'Trimming': '✂️',
      'Split Ends': '💔',
      'Maintenance': '🔄',
      'Protein': '🥚',
      'Balance': '⚖️',
      'Twists': '🌀',
      'Low Manipulation': '👐',
      'Clarifying': '✨',
      'Build-up': '🧽',
      'Hair Mask': '🎭',
      'Overnight Treatment': '🌙',
      'Deep Care': '❤️',
      'Styling': '💅',
      'Flexi Rods': '🪃',
      'Curl Definition': '〰️',
      'Exfoliation': '🧂',
      'Health': '🌟',
      'Vitamins': '💊',
      'Nutrition': '🥗',
      'Cornrows': '📏',
      'Hair Care': '💝',
      'Routine': '📅',
      'Consistency': '✅',
      'Product Review': '📝',
      'New Brand': '🆕',
      'Testing': '🧪',
      'Hair Length': '📐',
      'Progress': '📊',
      'Goals': '🎯',
      'Seasonal Care': '🍂',
      'Winter': '❄️',
      'Protection': '🛡️',
      'Hair Accessories': '🎀',
      'Fun': '🎉',
      'Hair Health': '💚',
      'Overall': '🌈',
      'Achievement': '🏆'
    }
    return categoryMap[category] || '✨'
  }

  if (compact) {
    return (
      <div 
        className="full-cell-entry cursor-pointer hover:bg-gray-50 transition-all duration-200"
        onClick={onClick}
      >
        <div className="flex items-center justify-center space-x-0.5 mb-1">
          {[...Array(5)].map((_, i) => (
            <span 
              key={i} 
              className={`text-xs leading-none ${i < Math.floor(entry.rating) ? 'text-blue-500' : 'text-gray-300'}`}>
              ★
            </span>
          ))}
        </div>
        
        <div className="image-container flex-1 mb-1">
          <img 
            src={entry.imgUrl} 
            alt="Journal entry"
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyOEMyNi4yMDkxIDI4IDI4IDI2LjIwOTEgMjggMjRDMjggMjEuNzkwOSAyNi4yMDkxIDIwIDI0IDIwQzIxLjc5MDkgMjAgMjAgMjEuNzkwOSAyMCAyNEMyMCAyNi4yMDkxIDIxLjc5MDkgMjggMjQgMjhaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xMiA0MEgzNkM0MC40MTgyIDQwIDQ0IDM2LjQxODIgNDQgMzJWMThDNDQgMTMuNTgxOCA0MC40MTgyIDEwIDM2IDEwSDEyQzcuNTgxNzIgMTAgNCAxMy41ODE4IDQgMThWMzJDNCAzNi40MTgyIDcuNTgxNzIgNDAgMTIgNDBaIiBzdHJva2U9IiM5QjlCQTAiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K'
            }}
          />
        </div>
        
        <div className="flex justify-center space-x-1">
          {entry.categories.slice(0, 2).map((category, index) => (
            <span key={index} className="text-base" title={category}>
              {getCategoryEmoji(category)}
            </span>
          ))}
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
