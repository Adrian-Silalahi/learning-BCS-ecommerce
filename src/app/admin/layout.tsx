import AdminNavbar from '@/src/components/Admin/adminNavbar'
import React from 'react'
export const metadata = {
  title: 'Eccomerce BCS Admin',
  description: 'Eccomerce BCS Dashboard'
}

const AdminLayout = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <div>
        <div><AdminNavbar/></div>
        {children}
    </div>
  )
}

export default AdminLayout
