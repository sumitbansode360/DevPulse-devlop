import React from 'react'
import Sidebar from '../components/SideBar'

function Promodoro() {
  return (
    <div className="flex">
        <Sidebar/>
        <div className="p-6 w-full">
        <h2 className="text-2xl font-bold mb-2">Promodoro Timer</h2>
        <p className="text-sm text-gray-500">
          Start building your productivity tools 🚀
        </p>
      </div>
    </div>
  )
}

export default Promodoro