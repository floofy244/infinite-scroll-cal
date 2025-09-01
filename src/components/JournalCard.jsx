import React, { useState, useEffect, useRef } from 'react'
import { parse, format } from 'date-fns'

const JournalCard = ({ entry, onClose, journalData }) => {
  const [currentEntry, setCurrentEntry] = useState(entry)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const cardRef = useRef(null)

  // Find current entry index
  useEffect(() => {
    const index = journalData.findIndex(item => item.date === entry.date)
    setCurrentIndex(index >= 0 ? index : 0)
    setCurrentEntry(entry)
  }, [entry, journalData])

  // Swipe threshold
  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      // Swipe left - go to next entry
      goToNext()
    } else if (isRightSwipe) {
      // Swipe right - go to previous entry
      goToPrevious()
    }
  }

  const goToNext = () => {
    if (currentIndex < journalData.length - 1 && !isAnimating) {
      setIsAnimating(true)
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      setCurrentEntry(journalData[nextIndex])
      setTimeout(() => setIsAnimating(false), 300)
    }
  }

  const goToPrevious = () => {
    if (currentIndex > 0 && !isAnimating) {
      setIsAnimating(true)
      const prevIndex = currentIndex - 1
      setCurrentEntry(journalData[prevIndex])
      setTimeout(() => setIsAnimating(false), 300)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      goToNext()
    } else if (e.key === 'ArrowRight') {
      goToPrevious()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex])

  const formatDate = (dateString) => {
    try {
      const date = parse(dateString, 'dd/MM/yyyy', new Date())
      return format(date, 'EEEE, MMMM do, yyyy')
    } catch (error) {
      return dateString
    }
  }

  return (
    <div 
      className="swipe-card"
      onClick={onClose}
    >
      <div 
        ref={cardRef}
        className={`swipe-card-content ${isAnimating ? 'animate-pulse' : ''}`}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 md:top-4 md:right-4 z-50 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Main Image - 60% of card height, smaller on mobile */}
        <div className="relative h-48 md:h-96 bg-gray-100">
          <img 
            src={currentEntry.imgUrl} 
            alt="Journal entry"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyOEMyNi4yMDkxIDI4IDI4IDI2LjIwOTEgMjggMjRDMjggMjEuNzkwOSAyNi4yMDkxIDIwIDI0IDIwQzIxLjc5MDkgMjAgMjAgMjEuNzkwOSAyMCAyNEMyMCAyNi4yMDkxIDIxLjc5MDkgMjggMjQgMjhaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xMiA0MEgzNkM0MC40MTgyIDQwIDQ0IDM2LjQxODIgNDQgMzJWMThDNDQgMTMuNTgxOCA0MC40MTgyIDEwIDM2IDEwSDEyQzcuNTgxNzIgMTAgNCAxMy41ODE4IDQgMThWMzJDNCAzNi40MTgyIDcuNTgxNzIgNDAgMTIgNDBaIiBzdHJva2U9IiM5QjlCQTAiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K'
            }}
          />
        </div>

        {/* Content Section */}
        <div className="p-3 md:p-6">
          {/* Tags and Stars Row */}
          <div className="flex items-center justify-between mb-3 md:mb-4">
            {/* Tags on the left */}
            <div className="flex flex-wrap gap-1 md:gap-2 flex-1 mr-2 md:mr-4">
              {currentEntry.categories.slice(0, 3).map((category, index) => (
                <span 
                  key={index}
                  className="px-2 md:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs md:text-sm font-medium"
                >
                  {category}
                </span>
              ))}
              {currentEntry.categories.length > 3 && (
                <span className="px-2 md:px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs md:text-sm">
                  +{currentEntry.categories.length - 3}
                </span>
              )}
            </div>
            
            {/* Stars on the right */}
            <div className="flex items-center space-x-1 flex-shrink-0">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i} 
                  className={`text-lg md:text-xl ${i < Math.floor(currentEntry.rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                >
                  ★
                </span>
              ))}
              <span className="ml-2 text-base md:text-lg font-semibold text-gray-700">
                {currentEntry.rating}
              </span>
            </div>
          </div>

          {/* Date */}
          <div className="mb-3 md:mb-4">
            <div className="text-base md:text-lg font-semibold text-gray-900">
              {formatDate(currentEntry.date)}
            </div>
          </div>

          {/* Journal Entry Details */}
          <div className="mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">Journal Entry</h3>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              {currentEntry.description}
            </p>
          </div>

          {/* View Full Post Button */}
          <div className="text-center">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 md:py-3 px-4 md:px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl text-sm md:text-base">
              View Full Post
            </button>
          </div>

          {/* Navigation Indicators */}
          <div className="flex items-center justify-center mt-4 md:mt-6 space-x-2">
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                currentIndex === 0 ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            />
            <div className={`w-3 h-3 rounded-full bg-blue-600`} />
            <button
              onClick={goToNext}
              disabled={currentIndex === journalData.length - 1}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                currentIndex === journalData.length - 1 ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            />
          </div>
        </div>

        {/* Swipe Instructions */}
        <div className="bg-gray-50 px-3 md:px-6 py-2 md:py-3 text-center text-xs md:text-sm text-gray-500">
          <div className="flex items-center justify-center space-x-2 md:space-x-4">
            <span>← Swipe left for next</span>
            <span>•</span>
            <span>Swipe right for previous →</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JournalCard
