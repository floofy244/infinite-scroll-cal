import React, { useState } from 'react'
import InfiniteCalendar from './components/InfiniteCalendar'
import JournalCard from './components/JournalCard'
import { sampleJournalData } from './data/sampleData'

function App() {
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [isCardOpen, setIsCardOpen] = useState(false)

  const handleEntryClick = (entry) => {
    setSelectedEntry(entry)
    setIsCardOpen(true)
  }

  const handleCloseCard = () => {
    setIsCardOpen(false)
    setSelectedEntry(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Journal Calendar</h1>
            <div className="text-sm text-gray-500">
              Infinite Scroll • Mobile Optimized
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <InfiniteCalendar 
          journalData={sampleJournalData}
          onEntryClick={handleEntryClick}
        />
      </main>

      {isCardOpen && selectedEntry && (
        <JournalCard
          entry={selectedEntry}
          onClose={handleCloseCard}
          journalData={sampleJournalData}
        />
      )}
    </div>
  )
}

export default App
