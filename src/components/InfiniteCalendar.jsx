import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
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
  const scrollTimeoutRef = useRef(null)

  const generateMonths = useCallback((centerDate, count = 12) => {
    const months = []
    const halfCount = Math.floor(count / 2)
    
    for (let i = -halfCount; i <= halfCount; i++) {
      const monthDate = addMonths(centerDate, i)
      months.push(monthDate)
    }
    
    months.sort((a, b) => a.getTime() - b.getTime())
    return months
  }, [])

  const initialMonths = useMemo(() => {
    const now = new Date()
    return generateMonths(now, 18)
  }, [generateMonths])

  useEffect(() => {
    setVisibleMonths(initialMonths)
    setHeaderMonth(new Date())
  }, [initialMonths])

  useEffect(() => {
    if (currentMonthRef.current && scrollContainerRef.current) {
      setTimeout(() => {
        currentMonthRef.current.scrollIntoView({ 
          behavior: 'auto',
          block: 'center' 
        })
      }, 50)
    }
  }, [visibleMonths])

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
        threshold: 0.3,
        rootMargin: '-10% 0px -10% 0px'
      }
    )

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    if (!observerRef.current) return

    monthRefs.current.forEach((ref, monthKey) => {
      if (ref && observerRef.current) {
        observerRef.current.observe(ref)
      }
    })
  }, [visibleMonths])

  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target
    const threshold = 500

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (scrollTop < threshold) {
        const firstMonth = visibleMonths[0]
        const newMonths = []
        for (let i = 1; i <= 4; i++) {
          newMonths.push(subMonths(firstMonth, i))
        }
        newMonths.sort((a, b) => a.getTime() - b.getTime())
        setVisibleMonths(prev => [...newMonths, ...prev])
      } else if (scrollHeight - scrollTop - clientHeight < threshold) {
        const lastMonth = visibleMonths[visibleMonths.length - 1]
        const newMonths = []
        for (let i = 1; i <= 4; i++) {
          newMonths.push(addMonths(lastMonth, i))
        }
        newMonths.sort((a, b) => a.getTime() - b.getTime())
        setVisibleMonths(prev => [...prev, ...newMonths])
      }
    }, 50)
  }, [visibleMonths])

  const setMonthRef = useCallback((monthDate, element) => {
    if (element) {
      monthRefs.current.set(monthDate.toISOString(), element)
      
      const now = new Date()
      if (monthDate.getMonth() === now.getMonth() && monthDate.getFullYear() === now.getFullYear()) {
        currentMonthRef.current = element
      }
    }
  }, [])

  const scrollToCurrentMonth = useCallback(() => {
    if (currentMonthRef.current && scrollContainerRef.current) {
      currentMonthRef.current.scrollIntoView({ 
        behavior: 'auto',
        block: 'center' 
      })
    }
  }, [])

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="relative">
      <div className="sticky top-16 sm:top-20 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 py-3 sm:py-4 mb-4 sm:mb-6">
        <div className="text-center">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 transition-all duration-200">
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
