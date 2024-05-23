import React , {useState, useEffect} from 'react'
import {Outlet } from 'react-router-dom'
import Sidebar from '../sidebars_/Sidebar'
import { onAuthStateChanged } from 'firebase/auth'
import {auth} from '../config/firebase.js'
import { useNavigate } from 'react-router-dom'
import Navbar from '../Navbar.jsx'


const HomeLayout = () => {

    const [user, setUser] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
            if (userAuth) {
              setUser(userAuth);
                // console.log(userAuth)
            } else {
                setUser(null);
              navigate('/auth/sign-in')
            }
          });
      
          return unsubscribe;
    }, [])

    return (
        <>
        {user && <div className='app'>
            <div className="nav-bar">
                <Navbar />
            </div>
            <div className="sidebar-space">
                <Sidebar />
            </div>
            <div className="outlet-space">
                <Outlet />
            </div>
            
            
        </div>}
        {!user && <p className='loading'>Loading...</p>}
        </>
        
    )
}

export default HomeLayout
