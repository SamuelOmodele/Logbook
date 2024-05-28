import React, { useState, useEffect } from 'react'
import './login.css'
import { Link } from 'react-router-dom'
import register from '../../assets/register-1.png'
import logo from '../../assets/E-book logo.png'
import { auth } from '../config/firebase'
import { db } from '../config/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc, getDocs } from 'firebase/firestore';

const Register = () => {
  const [name, setName] = useState("")
  const [matricNo, setMatricNo] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [organization, setOrganisation] = useState("")
  const [organizationEmail, setOrganisationEmail] = useState("")
  const [department, setDepartment] = useState("")
  const [departments, setDepartments] = useState([])
  const [errorMsg, setErrorMsg] = useState(null)
  const navigate = useNavigate();

  const [show, setShow] = useState(false);

  useEffect(() => {
    auth.signOut(); 
  }, []);

  // Function to fetch all documents from a collection
  const getAllDocuments = async (collectionName) => {
    try {
      const collectionRef = collection(db, collectionName);

      const querySnapshot = await getDocs(collectionRef);

      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data()
      }));

      // Return the array of documents
      return documents;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error; // Rethrow the error to handle it in the calling code
    }
  };

  useEffect(() => {
    // Usage example
    getAllDocuments('Department')
      .then((documents) => {
        setDepartments(documents);
      })
      .catch((error) => {
        // Handle any errors that occur during the fetching process
        console.error('Error:', error);
      });
  }, [])
  

  const registerStudent = async (e) => {
    e.preventDefault();
    // -- validation
    if (name === '' || matricNo === '' || email === '' || password === '' || organization === '' || department === '') {
      setErrorMsg('Please fill all fields');
    } else {
      try {
        await createUserWithEmailAndPassword(auth, email, password);

        await addDoc(collection(db, 'EntityType'), {
          email: email,
          category: 'student'
        });
        await addDoc(collection(db, 'StudentRecord'), {
          name: name,
          email: email,
          department: department,
          matricNo: matricNo,
          phone: phone,
          organization: organization,
          orgEmail: organizationEmail,
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
    <div className='sign-up'>
      <div className="sign-up-form">
        <div className="formLogo"><img src={logo} alt="" /></div>
        <span className="welcome">Register</span>
        <form action="" className="su-form" >
          {errorMsg && <p className='error'>{errorMsg}</p>}
          <div className="input-1 input">
            <label htmlFor="">Name</label>
            <input type="text" value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Enter full name' />
          </div>
          <div className="input-1 input">
            <label htmlFor="matric-number">Matric Number</label>
            <input type="text" value={matricNo}
              onChange={(e) => setMatricNo(e.target.value)}
              placeholder='Enter your matric number' />
          </div>
          <div className="input-2 input">
            <label htmlFor="email">Email Address</label>
            <input type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter your email address' />
          </div>
          <div className="input-3 input">
            <label htmlFor="password">Password</label>
            {!show && <div style={{position: 'relative'}}><input type="password" value={password} placeholder='Enter your password . . .' onChange={(e) => setPassword(e.target.value)}/><span class="material-symbols-outlined eye-icon" onClick={() => setShow(prev => !prev)}>visibility</span></div>}
            {show && <div style={{position: 'relative'}}><input type="text" value={password} placeholder='Enter your password . . .' onChange={(e) => setPassword(e.target.value)}/><span class="material-symbols-outlined eye-icon" onClick={() => setShow(prev => !prev)}>visibility_off</span></div>}
          </div>
          <div className="input-3 input">
            <label htmlFor="phone">Phone Number</label>
            <input type="number" value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder='Enter phone number' />
          </div>
          <div className="input-1 input">
            <label htmlFor="matric-number">Organization</label>
            <input type="text" value={organization}
              onChange={(e) => setOrganisation(e.target.value)}
              placeholder='Enter your organization' />
          </div>
          <div className="input-1 input">
            <label htmlFor="matric-number">Organization Email</label>
            <input type="text" value={organizationEmail}
              onChange={(e) => setOrganisationEmail(e.target.value)}
              placeholder='Enter your organization email' />
          </div>
          <div className="input-3 input">
            <label htmlFor="password">Department</label>
            <select value={department} onChange={(e) => setDepartment(e.target.value)}>
              <option value=''>-- Select --</option>
                  {departments?.map((dept, index) => (
                      <option value={dept.data.name} key={index}>{dept.data.name}</option>
                  ))}
              </select>
          </div>
        </form>
        <div className='button-wrap'>
          <button onClick={registerStudent} className="submit btn" type='submit'>Sign Up</button>
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
            <p className='create-acc' href="#"><Link to='/auth/sign-in'>Have an account? Sign in</Link></p>
            <p className='create-acc' href=""><Link to='/auth/sign-up-org'>Register as an orgnization</Link></p>
          </div>

        </div>
      </div>
      <div className="sign-up-form-image">
        <img src={register} alt="" />
      </div>

    </div>
  )
}

export default Register
