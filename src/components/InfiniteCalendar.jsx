import React, { useState, useEffect, useRef, useCallback } from 'react'
import { format, addMonths, subMonths } from 'date-fns'
import MonthView from './MonthView'

const InfiniteCalendar = ({ journalData, onEntryClick }) => {
  const [currentDate] = useState(new Date())
  const [visibleMonths, setVisibleMonths] = useState([])
  const [headerMonth, setHeaderMonth] = useState(new Date())
  const scrollContainerRef = useRef(null)
  const observerRef = useRef(null)
  const monthRefs = useRef(new Map())
  const currentMonthRef = useRef(null)

  // Generate months for infinite scrolling - fix the order
  const generateMonths = useCallback((centerDate, count = 12) => {
    const months = []
    const halfCount = Math.floor(count / 2)
    
    // Generate months in chronological order
    for (let i = -halfCount; i <= halfCount; i++) {
      const monthDate = addMonths(centerDate, i)
      months.push(monthDate)
    }
    
    // Sort to ensure chronological order
    months.sort((a, b) => a.getTime() - b.getTime())
    return months
  }, [])

  // Initialize months starting from current date
  useEffect(() => {
    const now = new Date()
    const months = generateMonths(now, 24) // Start with 24 months
    setVisibleMonths(months)
    setHeaderMonth(now) // Set header to current month
  }, [generateMonths])

  // Scroll to current month after initial render
  useEffect(() => {
    if (currentMonthRef.current && scrollContainerRef.current) {
      setTimeout(() => {
        currentMonthRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
      }, 100)
    }
  }, [visibleMonths])

  // Intersection Observer for month visibility
  useEffect(() => {
    if (!scrollContainerRef.current) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const monthDate = entry.target.dataset.month
            if (monthDate) {
              const date = new Date(monthDate)
              setHeaderMonth(date)
            }
          }
        })
      },
      {
        threshold: 0.5, // Month is considered visible when 50% is in viewport
        rootMargin: '-20% 0px -20% 0px'
      }
    )

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  // Observe month elements
  useEffect(() => {
    if (!observerRef.current) return

    monthRefs.current.forEach((ref, monthKey) => {
      if (ref && observerRef.current) {
        observerRef.current.observe(ref)
      }
    })
  }, [visibleMonths])

  // Handle scroll to load more months
  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target
    const threshold = 1000 // pixels from bottom/top to trigger loading

    // Load more months when scrolling near the edges
    if (scrollTop < threshold) {
      // Scrolling up - add months to the beginning
      const firstMonth = visibleMonths[0]
      const newMonths = []
      for (let i = 1; i <= 6; i++) {
        newMonths.push(subMonths(firstMonth, i))
      }
      // Sort new months and add to beginning
      newMonths.sort((a, b) => a.getTime() - b.getTime())
      setVisibleMonths(prev => [...newMonths, ...prev])
    } else if (scrollHeight - scrollTop - clientHeight < threshold) {
      // Scrolling down - add months to the end
      const lastMonth = visibleMonths[visibleMonths.length - 1]
      const newMonths = []
      for (let i = 1; i <= 6; i++) {
        newMonths.push(addMonths(lastMonth, i))
      }
      // Sort new months and add to end
      newMonths.sort((a, b) => a.getTime() - b.getTime())
      setVisibleMonths(prev => [...prev, ...newMonths])
    }
  }, [visibleMonths])

  // Set month ref for intersection observer
  const setMonthRef = useCallback((monthDate, element) => {
    if (element) {
      monthRefs.current.set(monthDate.toISOString(), element)
      
      // Set current month ref for scrolling
      const now = new Date()
      if (monthDate.getMonth() === now.getMonth() && monthDate.getFullYear() === now.getFullYear()) {
        currentMonthRef.current = element
      }
    }
  }, [])

  // Scroll to current month function
  const scrollToCurrentMonth = useCallback(() => {
    if (currentMonthRef.current && scrollContainerRef.current) {
      currentMonthRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      })
    }
  }, [])

  return (
    <div className="relative">
      {/* Dynamic Month Header */}
      <div className="sticky top-16 sm:top-20 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 py-3 sm:py-4 mb-4 sm:mb-6">
        <div className="text-center">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 transition-all duration-300">
            {format(headerMonth, 'MMMM yyyy')}
          </h2>
          <button 
            onClick={scrollToCurrentMonth}
            className="mt-2 px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            Go to Current Month
          </button>
        </div>
      </div>

      {/* Calendar Container */}
      <div 
        ref={scrollContainerRef}
        className="calendar-container overflow-y-auto max-h-[65vh] sm:max-h-[70vh] scrollbar-hide"
        onScroll={handleScroll}
      >
        <div className="space-y-4 sm:space-y-8">
          {visibleMonths.map((monthDate, index) => (
            <div
              key={monthDate.toISOString()}
              ref={(el) => setMonthRef(monthDate, el)}
              data-month={monthDate.toISOString()}
              className="month-container"
            >
              <MonthView
                monthDate={monthDate}
                journalData={journalData}
                onEntryClick={onEntryClick}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InfiniteCalendar
