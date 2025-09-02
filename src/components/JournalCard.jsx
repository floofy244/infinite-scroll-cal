import React, { useState, useEffect, useRef, useCallback } from 'react'
import { parse, format } from 'date-fns'

const JournalCard = ({ entry, onClose, journalData }) => {
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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useRef(null)
  const touchStartRef = useRef(null)
  const lastTouchRef = useRef(null)

  useEffect(() => {
    const index = journalData.findIndex(item => item.date === entry.date)
    setCurrentIndex(index >= 0 ? index : 0)
  }, [entry, journalData])

  const getVisibleCards = useCallback(() => {
    const cards = []
    for (let i = -1; i <= 1; i++) {
      const index = currentIndex + i
      if (index >= 0 && index < journalData.length) {
        cards.push({
          index,
          entry: journalData[index],
          offset: i
        })
      }
    }
    return cards
  }, [currentIndex, journalData])

  const handleStart = useCallback((e) => {
    if (isAnimating) return
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    touchStartRef.current = clientX
    lastTouchRef.current = clientX
    setIsDragging(true)
    setDragOffset(0)
  }, [isAnimating])

  const handleMove = useCallback((e) => {
    if (!isDragging || !touchStartRef.current) return
    
    e.preventDefault()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const diff = clientX - touchStartRef.current
    
    const maxDrag = 300
    const limitedDiff = Math.max(-maxDrag, Math.min(maxDrag, diff))
    
    setDragOffset(limitedDiff)
    lastTouchRef.current = clientX
  }, [isDragging])

  const handleEnd = useCallback(() => {
    if (!isDragging) return
    
    setIsDragging(false)
    
    const threshold = 80
    
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0 && currentIndex > 0) {
        setIsAnimating(true)
        setCurrentIndex(prev => prev - 1)
      } else if (dragOffset < 0 && currentIndex < journalData.length - 1) {
        setIsAnimating(true)
        setCurrentIndex(prev => prev + 1)
      }
    }
    
    setDragOffset(0)
    setTimeout(() => setIsAnimating(false), 300)
  }, [isDragging, dragOffset, currentIndex, journalData.length])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e) => handleMove(e)
    const handleMouseUp = () => handleEnd()

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMove, handleEnd])

  const handleKeyDown = useCallback((e) => {
    if (isAnimating) return
    
    if (e.key === 'ArrowLeft' && currentIndex < journalData.length - 1) {
      setIsAnimating(true)
      setCurrentIndex(prev => prev + 1)
      setTimeout(() => setIsAnimating(false), 300)
    } else if (e.key === 'ArrowRight' && currentIndex > 0) {
      setIsAnimating(true)
      setCurrentIndex(prev => prev - 1)
      setTimeout(() => setIsAnimating(false), 300)
    } else if (e.key === 'Escape') {
      onClose()
    }
  }, [currentIndex, journalData.length, isAnimating, onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const formatDate = useCallback((dateString) => {
    try {
      const date = parse(dateString, 'dd/MM/yyyy', new Date())
      return format(date, 'EEEE, MMMM do, yyyy')
    } catch (error) {
      return dateString
    }
  }, [])

  const currentEntry = journalData[currentIndex]

  return (
    <div 
      className="recents-swiper-overlay"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 w-10 h-10 bg-black bg-opacity-30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-opacity-50 transition-all duration-200"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div 
        ref={containerRef}
        className="recents-swiper-container"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleStart}
      >
        {getVisibleCards().map(({ index, entry, offset }) => {
          const baseTransform = offset * 320 + dragOffset
          const scale = offset === 0 ? 1 : 0.85
          const opacity = offset === 0 ? 1 : 0.6
          const zIndex = offset === 0 ? 10 : 5 - Math.abs(offset)

          return (
            <div
              key={index}
              className={`recents-swiper-card ${isDragging ? '' : 'transition-transform'}`}
              style={{
                transform: `translateX(${baseTransform}px) scale(${scale})`,
                opacity,
                zIndex,
                transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div className="recents-card-content">
                <div className="relative h-48 sm:h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-3xl overflow-hidden">
                  <img 
                    src={entry.imgUrl} 
                    alt="Journal entry"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyOEMyNi4yMDkxIDI4IDI4IDI2LjIwOTEgMjggMjRDMjggMjEuNzkwOSAyNi4yMDkxIDIwIDI0IDIwQzIxLjc5MDkgMjAgMjAgMjEuNzkwOSAyMCAyNEMyMCAyNi4yMDkxIDIxLjc5MDkgMjggMjQgMjhaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xMiA0MEgzNkM0MC40MTgyIDQwIDQ0IDM2LjQxODIgNDQgMzJWMThDNDQgMTMuNTgxOCA0MC40MTgyIDEwIDM2IDEwSDEyQzcuNTgxNzIgMTAgNCAxMy41ODE4IDQgMThWMzJDNCAzNi40MTgyIDcuNTgxNzIgNDAgMTIgNDBaIiBzdHJva2U9IiM5QjlCQTAiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K'
                    }}
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>

                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {entry.categories.slice(0, 2).map((category, catIndex) => (
                      <span 
                        key={catIndex}
                        className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm font-medium border border-blue-100"
                      >
                        <span className="text-sm sm:text-base">{getCategoryEmoji(category)}</span>
                        <span className="hidden sm:inline">{category}</span>
                      </span>
                    ))}
                    {entry.categories.length > 2 && (
                      <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-50 text-gray-600 rounded-full text-xs sm:text-sm border border-gray-100">
                        +{entry.categories.length - 2}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-base sm:text-lg font-semibold text-gray-900">
                      {formatDate(entry.date)}
                    </div>
                    <div className="flex items-center space-x-0.5 sm:space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={`text-sm sm:text-lg ${i < Math.floor(entry.rating) ? 'text-blue-500' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                      <span className="ml-1 sm:ml-2 text-sm sm:text-lg font-semibold text-gray-700">
                        {entry.rating}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                      {entry.description}
                    </p>
                  </div>

                  <div className="pt-1 sm:pt-2">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] text-sm sm:text-base">
                      View full Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-1.5 sm:space-x-2">
        {journalData.map((_, index) => (
          <div 
            key={index}
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-200 ${
              index === currentIndex ? 'bg-white w-4 sm:w-6' : 'bg-white/50'
            }`} />
        ))}
      </div>

      <div className="absolute bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2 text-white/80 text-xs sm:text-sm text-center">
        Swipe to navigate
      </div>
    </div>
  )
}

export default JournalCard
