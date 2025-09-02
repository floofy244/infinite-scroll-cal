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
      <main className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-2 sm:py-6">
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
