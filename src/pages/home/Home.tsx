import Layout from '@/components/layout/Layout'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './dashboard/Dashboard'
import Analytics from './dashboard/Analytics'
import Reports from './dashboard/Reports'

const Home = () => {
  return (
    <Layout>Home
        <div className="p-4">
            <h1 className="text-2xl font-bold">Welcome to the Home Page</h1>
            <p className="mt-2">This is the main content area.</p>
        </div>
        <Routes>
            <Route path="/:query?" element={<Dashboard/>}/>
            <Route path="/analytics" element={<Analytics/>}/>
            <Route path="/reports" element={<Reports/>}/>
            
         
        </Routes>
    </Layout>
  )
}

export default Home