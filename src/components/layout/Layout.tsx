import React from 'react'
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar'
import AppSidebar from './AppSidebar'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
       <SidebarProvider>
      <AppSidebar />
      <main className='flex-1 p-4'>
        <SidebarTrigger />
        {children}  
      </main>
    </SidebarProvider>
  )
}

export default Layout