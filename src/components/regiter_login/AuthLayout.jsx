import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import Sidebar from '../sidebars_/Sidebar'

const AuthLayout = () => {
    return (
        <div>
            <Outlet />
        </div>
    )
}

export default AuthLayout
