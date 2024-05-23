import React from 'react'
import './Sidebar.css'
import { Link, useLocation} from 'react-router-dom'
import profileImg from '../../assets/University-of-Ibadan.jpg'
import logo from '../../assets/E-book logo.png'

const SidebarAdmin = () => {

    const location = useLocation();
    const currentPath = location.pathname;

  return (
    <nav className="sidebar">

   
        <img style={{width: '100px'}} src={logo} className='imgLogo' alt="" />
    

    <div>
        <Link className='link' to='/admin'><li className='sidebar-link active' id={(currentPath === '/admin') ? 'active' : ''}><ion-icon name="home-outline"></ion-icon>Home</li></Link>
        <Link className='link' to='/admin/departments'><li className='sidebar-link' id={(currentPath === '/admin/departments') ? 'active' : ''}><span className="material-symbols-outlined">meeting_room</span>Departments</li></Link>
        <Link className='link' to='/admin/viewDepartmentSupervisors'><li className='sidebar-link' id={(currentPath === '/admin/viewDepartmentSupervisors') ? 'active' : ''}><ion-icon name="people-outline"></ion-icon>Department Supervisors</li></Link>
        <Link className='link' to='/auth/sign-in'><li className='sidebar-link'><ion-icon name="log-out-outline"></ion-icon> Logout</li></Link>
        <li className='profile'>
            <Link className='profile_' to='#'>
                <div style={{ height: '3rem', width: '3rem' }} className="profile-img">
                    <img style={{ width: '100%' }} src={profileImg} alt="" />
                </div>
                <div className="profile-details" >
                    <span className="btm-span">
                        <span style={{fontFamily:'poppins'}}>ITCC Administrator</span>
                        
                    </span>
                </div>
            </Link>
        </li>
        

    </div>


    </nav>
    
    
  )
}

export default SidebarAdmin