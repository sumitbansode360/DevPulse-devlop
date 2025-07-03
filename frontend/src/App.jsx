import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Sidebar from './components/SideBar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex">
      <Sidebar/>
      {/* Main Content */}
      <div className="p-6 w-full">
        <h2 className="text-2xl font-bold mb-2">Dashboard Content</h2>
        <p className="text-sm text-gray-500">
          Start building your productivity tools 🚀
        </p>
      </div>
    </div>
  )
}

export default App
