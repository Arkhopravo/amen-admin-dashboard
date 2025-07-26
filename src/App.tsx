
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Authentication/Login'

import Register from './pages/Authentication/Register'
import Home from './pages/home/Home'

import { ProtectedRoute } from './components/ProtectedRoute'
import Users from './pages/users/Users'



const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/register",
    element: <Register/>
  },
  {
    path: "/home/*",
    element: (
  <ProtectedRoute>
      <Home/>
   </ProtectedRoute>
  )
  },
  {
    path: "/users/*",
    element:(
      <ProtectedRoute>
      <Users/>
       </ProtectedRoute>
      ) // Assuming Users is a part of Home layout
  }

])

const App = () => {
  
  return (
    <div className='items-center justify-center flex'>
       <RouterProvider router= {router}/>
    </div>
  )
}

export default App