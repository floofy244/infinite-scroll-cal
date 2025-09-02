import React from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameDay, isToday, parse } from 'date-fns'
import JournalEntry from './JournalEntry'

const MonthView = ({ monthDate, journalData, onEntryClick }) => {
  const monthStart = startOfMonth(monthDate)
  const monthEnd = endOfMonth(monthDate)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const weeks = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  const getEntriesForDate = (date) => {
    return journalData.filter(entry => {
      try {
        const entryDate = parse(entry.date, 'dd/MM/yyyy', new Date())
        return isSameDay(entryDate, date)
      } catch (error) {
        return false
      }
    })
  }

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="month-view px-2 sm:px-0">
      <div className="text-center mb-3 sm:mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
          {format(monthDate, 'MMMM yyyy')}
        </h3>
      </div>

      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2">
        {weekdays.map(day => (
          <div key={day} className="text-center py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {weeks.flat().map((day, index) => {
          const isCurrentMonth = isSameMonth(day, monthDate)
          const isCurrentDay = isToday(day)
          const dayEntries = getEntriesForDate(day)
          
          return (
            <div
              key={day.toISOString()}
              className={`calendar-day ${
                isCurrentDay ? 'today' : ''
              } ${
                !isCurrentMonth ? 'other-month' : ''
              }`}>
              <div className={`text-xs sm:text-sm font-medium mb-1 ${
                isCurrentDay ? 'text-blue-600' : 
                isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {format(day, 'd')}
              </div>

              <div className="flex-1 flex flex-col">
                {dayEntries.slice(0, 1).map((entry, entryIndex) => (
                  <JournalEntry
                    key={`${entry.date}-${entryIndex}`}
                    entry={entry}
                    onClick={() => onEntryClick(entry)}
                    compact={true}
                    dayNumber={format(day, 'd')}
                  />
                ))}
                {dayEntries.length > 1 && (
                  <div className="text-xs text-gray-500 text-center mt-auto">
                    +{dayEntries.length - 1} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MonthView
