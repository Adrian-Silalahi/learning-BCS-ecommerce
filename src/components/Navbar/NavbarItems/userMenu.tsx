/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable multiline-ternary */
'use client'
import React, { useState, useCallback } from 'react'
import Avatar from '../../Avatar'
import { AiFillCaretDown } from 'react-icons/ai'
import Link from 'next/link'
import MenuItem from '../Navigation/menuItem'
import { signOut } from 'next-auth/react'
import BackDrop from './backDrop'
import { type SafeUser } from '@/src/types'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface UserMenuProps {
  currentUser: SafeUser
}
const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const [isDropDown, setIsDropDown] = useState(false)

  const changeToggle = useCallback(() => {
    setIsDropDown((prev) => !prev)
  }, [])

  const router = useRouter()

  return (
    <>
      <div className="relative z-30">
        
        <div
          onClick={changeToggle}
          className="p-2 border-[1px] border-slate-400 flex flex-row items-center gap-1 rounded-full cursor-pointer hover:shadow-md transition text-slate-700"
        >
          <Avatar src={currentUser?.image}/>
          <AiFillCaretDown />
        </div>

        {isDropDown && (
          <div className="absolute rounded-md shadow-md w-[170px] bg-white overflow-hidden right-0 top-12 text-sm flex flex-col cursor-pointer">
            {currentUser ? (<div>
              <Link href="/orders">
                <MenuItem changeToggle={changeToggle}>Your Orders</MenuItem>
              </Link>
              {currentUser?.role === 'ADMIN' && (
                              <Link href="/admin">
                              <MenuItem changeToggle={changeToggle}>Admin Dashboard</MenuItem>
                            </Link>
              )}
              <MenuItem
                changeToggle={ async () => {
                  changeToggle()
                  await signOut().then(() => { toast.success('Success Logout') })
                }}
              >
                Logout
              </MenuItem>
            </div>)
              : (<div>
                <MenuItem changeToggle={() => {
                  changeToggle()
                  router.push('/login')
                  router.refresh() 
                }}>Login</MenuItem>
                <MenuItem changeToggle={() => {
                  changeToggle()
                  router.push('/register')
                  router.refresh() 
                }}>Register</MenuItem>
            </div>)}

          </div>
        )}
      </div>

      {isDropDown ? <BackDrop changeToggle={changeToggle} /> : null}
    </>
  )
}

export default UserMenu
