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
  const isCurrentUser = currentUser !== null && currentUser !== undefined
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
            {isCurrentUser ? (<div>
              <Link href="/orders">
                <MenuItem changeToggle={changeToggle}>Your Orders</MenuItem>
              </Link>
              <Link href="/admin">
                <MenuItem changeToggle={changeToggle}>Admin Dashboard</MenuItem>
              </Link>
              <MenuItem
                changeToggle={ async () => {
                  changeToggle()
                  await signOut().then(() => { toast.success('Berhasil Logout') })
                }}
              >
                Logout
              </MenuItem>
            </div>)
              : (<div>
                <MenuItem changeToggle={() => {
                  changeToggle()
                  router.push('/login')
                  router.refresh() // Kalo ga di refresh, ketika nanti di login page, meskipun path url di browser sudah berganti, pada variabel untuk menangkap path url di layout page, path urlnya ga berganti ke "/login", mengakibatkan navbar&footer tetap tampil di halaman login
                }}>Login</MenuItem>
                <MenuItem changeToggle={() => {
                  changeToggle()
                  router.push('/register')
                  router.refresh() // Sama penjelesannya seperi pada login page
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
