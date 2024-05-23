import React, { useEffect, useState } from 'react'
import {Outlet } from 'react-router-dom'


import SidebarAdmin from '../sidebars_/SidebarAdmin'

const AdminLayout = () => {
    
    return (
        <div className='app'>
            
            <div className="sidebar-space">
                <SidebarAdmin />
            </div>
            <div className="outlet-space">
                <Outlet />
            </div>

        </div>
    )
}

export default AdminLayout
