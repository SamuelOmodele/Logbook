import React from 'react'
import { Outlet } from 'react-router-dom'
import SidebarOrg from '../sidebars_/SidebarOrg'


const OrgLayout = () => {
    return (
        <div className='app'>
            <div className="sidebar-space">
                <SidebarOrg />
            </div>
            <div className="outlet-space">
                <Outlet />
            </div>
        </div>
    )
}

export default OrgLayout
