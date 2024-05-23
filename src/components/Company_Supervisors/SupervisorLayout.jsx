import React, { useEffect, useState } from 'react'
import { Link,Outlet } from 'react-router-dom'
import './SupervisorLayout.css'
import SidebarIndSup from '../sidebars_/SidebarIndSup'
import {updatePassword} from 'firebase/auth'
import { auth } from '../config/firebase'


const SupervisorLayout = () => {
    const [storedPassword, setStoredPassword] = useState(null);
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    useEffect(() => {
        let password = localStorage.getItem('password');
        setStoredPassword(password);
    })

    const resetPassword = async(e) => {

        e.preventDefault();
        try{
            const user = auth.currentUser;
            if(user){
                await updatePassword(user, password);
                localStorage.setItem('password', password);
                alert('Password updated successfully');
                window.location.reload();
            } else {
                alert('no user signed in')
            }
        }catch(err){
            console.log(err)
        }
    }
    
    return (
        <>
        {storedPassword === 'password' && 
        <div className='app'>
            <div className="background"></div>
            <div className="popup-form">
                <h3>Change your password</h3>
                <form action="" onSubmit={resetPassword}>
                    <div style={{width: '100%'}}>
                        <label htmlFor="">New Password <span style={{fontSize: '11px', fontWeight: '400'}}>( minimum of 6 characters )</span></label>
                        <input type="password" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div style={{width: '100%'}}>
                        <label htmlFor="">Confirm Password</label>
                        <input type="password" placeholder='password'  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                    </div>
                    {(password !== '' && confirmPassword !== '' && (password !== confirmPassword)) && <p className='error' style={{fontSize: '13px', margin: '-5px 0' }}>Passwords do not match</p>}
                    <div style={{width: '100%'}}>
                    {(password.length >= 6 && confirmPassword.length >= 6 && (password === confirmPassword)) ? <button>Reset Password</button> : <button disabled>Reset Password</button>}
                        
                    </div>

                    </form>
            </div>
            
        </div>}
        <div className='app'>
            <div className="sidebar-space">
                <SidebarIndSup />
            </div>
            <div className="outlet-space">
                <Outlet />
            </div>
        </div>

        

        </>
    )
}

export default SupervisorLayout