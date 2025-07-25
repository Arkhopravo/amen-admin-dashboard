
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Authentication/Login'
import Dashboard from './pages/dashboard/Dashboard'
import Register from './pages/Authentication/Register'



const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>
  },
  {

    path: "/register",
    element: <Register/>  

  },
  {
    path: "/dashboard",
    element: <Dashboard/>
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