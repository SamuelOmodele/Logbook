import React, { useState, useEffect } from 'react'
import './login.css'
import { Link } from 'react-router-dom'
import image from '../../assets/sign-in..png'
import { auth } from '../config/firebase'
import { signInWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase'

const Sign_in = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null)
  
  const navigate = useNavigate();

  useEffect(() => {
    auth.signOut(); 
  }, []);
  

  const handleLogin = async (e) => {
    e.preventDefault();

    // -- validation --
    if (email === ''){
      setErrorMsg('Enter Email');
    } else if (password === ''){
      setErrorMsg('Enter Password');
    } else {
      try{
        await signInWithEmailAndPassword(auth, email, password);

        try {
          const q = query(collection(db, 'EntityType'), where('email', '==', email));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {

            querySnapshot.forEach((doc) => {
              const category = doc.data().category;
              console.log(category);
              if (category === 'student') {
                localStorage.setItem('email', email);
                navigate('/')
              }  else if (category === 'dept-sup'){
                localStorage.setItem('email', email);
                localStorage.setItem('password', password);
                navigate('/dept-supervisor');
              } else if (category === 'admin'){
                localStorage.setItem('email', email);
                localStorage.setItem('password', password);
                navigate('/admin');
              } else if (category === 'org-sup'){
                localStorage.setItem('password', password);
                localStorage.setItem('email', email);
                navigate('/supervisor');
              } else if (category === 'organization'){
                localStorage.setItem('password', password);
                localStorage.setItem('email', email);
                navigate('/org');
              }
              
            });
          } else {
            console.log("User data not found");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
       
      } catch (err) {
        console.error(err)
        setErrorMsg('Invalid Email or Password');
      }
    }
  }
  return (   
    <div className='sign-in'>
      <div className="sign-up-form center">
        <span className="welcome">Welcome Back!</span>
        <form action="" className="su-form">
          {errorMsg && <p className='error'>{errorMsg}</p>}
          <div className="input-1 input">
            <label htmlFor="matric-number">Email </label>
            <input type="text" placeholder='Enter your Email . . .' onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className="input-3 input">
            <label htmlFor="password">Password</label>
            <input type="password" placeholder='Enter your password . . .' onChange={(e) => setPassword(e.target.value)}/>
            <a className='forgot-password' href="#">Forgot password?</a>
          </div>
        </form>
        <div className='button-wrap'>
          <button className="submit btn" onClick={handleLogin}>Login</button>
          <p className='create-acc' href="#"><Link to='/auth/sign-up'>New User? Register</Link></p>
          <span><a href=""></a></span>
        </div>
      </div>
      <div className="sign-up-form-image">
        <img src={image} alt="" />
      </div>
    </div>
  )
} 

export default Sign_in
