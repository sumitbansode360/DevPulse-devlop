import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import NotFound from './components/NotFound.jsx'
import TaskList from './Pages/TaskList.jsx'
import LearnLog from './Pages/LearnLog.jsx'
import Promodoro from './Pages/Promodoro.jsx'
import GitTracker from './Pages/GitTracker.jsx'


const route = createBrowserRouter([

  {
    path : '/',
    element : <App />,
    errorElement : <NotFound />
  },
  {
    path : '/tasks',
    element : <TaskList />,
    errorElement : <NotFound />
  },
  {
    path : '/learnings',
    element : <LearnLog />,
    errorElement : <NotFound />
  },
  {
    path : '/promodoro',
    element : <Promodoro />,
    errorElement : <NotFound />
  },
  {
    path : '/githubtracker',
    element : <GitTracker />,
    errorElement : <NotFound />
  }

])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={route}/>
  </StrictMode>,
)
