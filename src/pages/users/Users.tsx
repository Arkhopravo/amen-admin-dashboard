import Layout from '@/components/layout/Layout'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {  UserPlus, Settings, Users2 } from 'lucide-react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import NewUser from './subData/NewUser'
import EditUser from './subData/EditUser'
import AllUsers from './subData/AllUsers'

const Users = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Get current tab based on route
  const currentTab = location.pathname.includes('create-new') 
    ? 'create' 
    : location.pathname.includes('edit') 
      ? 'edit' 
      : 'all'

  return (
    <Layout>
      <div className="space-y-6 p-6">
        {/* Header Section */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage all user accounts and permissions
            </p>
          </div>
          
        
        </div>



        {/* Main Content */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <Routes>
            <Route path='/:query?' element={<AllUsers />} />
            <Route path='/create-new' element={<NewUser />} />
            <Route path='/edit/:id' element={<EditUser />} />
          </Routes>
        </div>
      </div>
    </Layout>
  )
}

export default Users