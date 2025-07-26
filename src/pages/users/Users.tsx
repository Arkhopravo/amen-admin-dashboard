import Layout from '@/components/layout/Layout'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AllUsers from './subData/AllUsers'
import NewUser from './subData/NewUser'
import EditUser from './subData/EditUser'

const Users = () => {
  return (
    <Layout>Users
        <div className='p-4'>
            <h1 className='text-2xl font-bold'>Users Page</h1>
            {/* Add your users page content here */}
        </div>
        <Routes>
            {/* Define nested routes here if needed */}
            <Route path='/:query?' element={<AllUsers/>} />
            <Route path='/create-new' element={<NewUser/>} />
            <Route path='/edit/:id' element={<EditUser/>} />
        </Routes>
    </Layout>
  )
}

export default Users