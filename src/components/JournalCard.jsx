import React, { useState, useEffect, useRef } from 'react'
import { parse, format } from 'date-fns'

const JournalCard = ({ entry, onClose, journalData }) => {
  const [currentEntry, setCurrentEntry] = useState(entry)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
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
    if (currentIndex < journalData.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      setCurrentEntry(journalData[nextIndex])
    }
  }

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1
      setCurrentIndex(prevIndex)
      setCurrentEntry(journalData[prevIndex])
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
        className="swipe-card-content"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="text-white hover:text-blue-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-center">
              <div className="text-sm opacity-90">Journal Entry</div>
              <div className="text-lg font-semibold">{formatDate(currentEntry.date)}</div>
            </div>
            <div className="w-6"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image */}
          <div className="mb-6">
            <img 
              src={currentEntry.imgUrl} 
              alt="Journal entry"
              className="w-full h-48 object-cover rounded-lg shadow-md"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyOEMyNi4yMDkxIDI4IDI4IDI2LjIwOTEgMjggMjRDMjggMjEuNzkwOSAyNi4yMDkxIDIwIDI0IDIwQzIxLjc5MDkgMjAgMjAgMjEuNzkwOSAyMCAyNEMyMCAyNi4yMDkxIDIxLjc5MDkgMjggMjQgMjhaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xMiA0MEgzNkM0MC40MTgyIDQwIDQ0IDM2LjQxODIgNDQgMzJWMThDNDQgMTMuNTgxOCA0MC40MTgyIDEwIDM2IDEwSDEyQzcuNTgxNzIgMTAgNCAxMy41ODE4IDQgMThWMzJDNCAzNi40MTgyIDcuNTgxNzIgNDAgMTIgNDBaIiBzdHJva2U9IiM5QjlCQTAiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K'
              }}
            />
          </div>

          {/* Rating */}
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i} 
                  className={`text-2xl ${i < Math.floor(currentEntry.rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="ml-3 text-lg font-semibold text-gray-700">
              {currentEntry.rating}
            </span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {currentEntry.description}
            </p>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {currentEntry.categories.map((category, index) => (
                <span 
                  key={index}
                  className="px-3 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentIndex === 0 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Previous</span>
            </button>

            <div className="text-sm text-gray-500">
              {currentIndex + 1} of {journalData.length}
            </div>

            <button
              onClick={goToNext}
              disabled={currentIndex === journalData.length - 1}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentIndex === journalData.length - 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              <span>Next</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Swipe Instructions */}
        <div className="bg-gray-50 px-6 py-3 text-center text-sm text-gray-500">
          <div className="flex items-center justify-center space-x-4">
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
