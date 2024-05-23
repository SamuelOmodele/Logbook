import React, { useState, useEffect } from 'react'
import './login.css'
import { Link } from 'react-router-dom'
import register from '../../assets/register-1.png'
import logo from '../../assets/E-book logo.png'
import { auth } from '../config/firebase'
import { db } from '../config/firebase'
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc } from 'firebase/firestore';



const RegisterOrganzation = () => {

    useEffect(() => {
        auth.signOut(); // Sign out the current user when the component mounts
    }, []);

    const [orgName, setOrgName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [errorMsg, setErrorMsg] = useState(null)
    const navigate = useNavigate();

    const SignUpOrg = async (e) => {
        e.preventDefault();

        // -- validation
        if (orgName === '' || email === '' || password === '' || phone === '' || address === ''){
            setErrorMsg('Please fill all fields');
        } else {

        

            try {
                await createUserWithEmailAndPassword(auth, email, password);

                await addDoc(collection(db, 'EntityType'), {
                    email: email,
                    category: 'organization'
                });
                await addDoc(collection(db, 'OrganizationRecord'), {
                    orgName: orgName,
                    email: email,
                    phone: phone,
                    address: address
                });


                alert('Registration Successful')
                console.log('success');
                navigate('/auth/sign-in')

            } catch (err) {
                console.error(err)
                alert(err)
            }
        }
    }



    return (
        <div className='sign-up' >
            <div className="sign-up-form">
                <div className="formLogo"><img src={logo} alt="" /></div>
                <span className="welcome organization-head">Register as an Orgnization</span>
                <form action="" className="su-form">
                    {errorMsg && <p className='error'>{errorMsg}</p>}
                    <div className="input-1 input">
                        <label htmlFor="">Organization Name</label>
                        <input type="text" value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            placeholder='Organization Name' />
                    </div>
                    <div className="input-2 input">
                        <label htmlFor="email">Email Address</label>
                        <input type="email" value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Organization Email Address' />
                    </div>
                    <div className="input-3 input">
                        <label htmlFor="password">Password</label>
                        <input type="alphanumeric" value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Password' />
                    </div>
                    <div className="input-1 input">
                        <label htmlFor="">Contact address</label>
                        <input type="number" value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder='Organization Contact' />
                    </div>
                    <div className="input-3 input">
                        <label htmlFor="">Address</label>
                        <input type="" value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder='Organization Address' />
                    </div>
                </form>
                <div className='button-wrap'>
                    <button className="submit btn" onClick={SignUpOrg}>Sign Up</button>
                    <p className='create-acc' href="#"><Link to='/auth/sign-in'>Have an account? Sign in</Link></p>
                </div>
            </div>

            <div className="sign-up-form-image">
                <img src={register} alt="" />
            </div>

        </div>
    )
}

export default RegisterOrganzation