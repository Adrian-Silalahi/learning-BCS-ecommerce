import AdminNav from '@/src/components/Admin/adminNav'
import React from 'react'
export const metadata = {
    title: 'Eccomerce BCS Admin',
    description: 'Eccomerce BCS Dashboard',
}

const AdminLayout = ({children} : {children: React.ReactNode}) => {
  return (
    <div>
        <div><AdminNav/></div>
        {children}
    </div>
  )
}

export default AdminLayout