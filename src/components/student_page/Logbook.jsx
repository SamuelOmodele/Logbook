import React, {useState, useEffect} from 'react'
import './Logbook.css'
import { Link } from 'react-router-dom'
import profileImg from '../../assets/default3.webp'
import Work_Report from './Work_Report'
import { auth } from '../config/firebase'
import {onAuthStateChanged} from 'firebase/auth'
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase'


const Logbook = () => {


  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState('')

  useEffect(() => {
      const fetchUser = async () => {
          onAuthStateChanged(auth, async (userAuth) => {
              if (userAuth) {
                  try {
                      const q = query(collection(db, 'StudentRecord'), where('email', '==', userAuth.email));
                      const querySnapshot = await getDocs(q);
                      if (!querySnapshot.empty) {
                          querySnapshot.forEach((doc) => {
                            setUserId(doc.id);
                            fetchDocument(doc.id);
                          });
                      } else {
                          console.log("User data not found");
                      }
                  } catch (error) {
                      console.error("Error fetching user data:", error);
                      // Handle error appropriately (e.g., show error message to user)
                  }
              } else {
                  console.log('User not logged in');
                  // Handle case where user is not logged in (if needed)
              }
          });
      }

      const fetchDocument = async (id) => {
          try {
              const docRef = doc(db, 'StudentRecord', id);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                  setUser(docSnap.data());
              } else {
                  console.log("Document not found");
                  // Handle case where document does not exist (if needed)
              }
          } catch (error) {
              console.error("Error fetching document:", error);
              // Handle error appropriately (e.g., show error message to user)
          }
      }

      fetchUser(); // Call fetchUser directly
  }, []);

  return (
    <>
    {user && <div className='Logbook'>
      {/* {console.log(userId)} */}

      <div className="heading">
        <span>Logbook</span>
      </div>

      <li className='profile'>
        <Link className='profile_' to='#'>
          <div style={{ height: '3rem', width: '3rem' }} className="profile-img">
            {!user.image && <img style={{ width: '100%' }} src={profileImg} alt="" />}
            {user.image && <img style={{ width: '100%' }} src={user.image} alt="" />}
          </div>
          <div className="profile-details">
            <span><b>{user.name}</b></span>
            <span className="btm-span">
              <span>{user.department}</span>
            </span>
          </div>
        </Link>
      </li>

      <div className="weekly-log">
        <div>
          <div className="lwk-log-head">
            <span>Week 1</span>
          </div>
          <div className="work-report">
            <Work_Report week={'wk-1'} id={userId} />
          </div>
        </div>

        <div>
          <div className="lwk-log-head">
            <span>Week 2</span>
          </div>
          <div className="work-report">
            <Work_Report week={'wk-2'} id={userId}/>
          </div>
        </div>

        <div>
          <div className="lwk-log-head">
            <span>Week 3</span>
          </div>
          <div className="work-report">
            <Work_Report week={'wk-3'} id={userId}/>
          </div>
        </div>

        <div>
          <div className="lwk-log-head">
            <span>Week 4</span>
          </div>
          <div className="work-report">
            <Work_Report week={'wk-4'} id={userId}/>
          </div>
        </div>

        <div>
          <div className="lwk-log-head">
            <span>Week 5</span>
          </div>
          <div className="work-report">
            <Work_Report week={'wk-5'} id={userId}/>
          </div>
        </div>

        <div>
          <div className="lwk-log-head">
            <span>Week 6</span>
          </div>
          <div className="work-report">
            <Work_Report week={'wk-6'} id={userId}/>
          </div>
        </div>

        <div>
          <div className="lwk-log-head">
            <span>Week 7</span>
          </div>
          <div className="work-report">
            <Work_Report week={'wk-7'} id={userId}/>
          </div>
        </div>

        <div>
          <div className="lwk-log-head">
            <span>Week 8</span>
          </div>
          <div className="work-report">
            <Work_Report week={'wk-8'} id={userId}/>
          </div>
        </div>

        <div>
          <div className="lwk-log-head">
            <span>Week 9</span>
          </div>
          <div className="work-report">
            <Work_Report week={'wk-9'} id={userId}/>
          </div>
        </div>

        <div>
          <div className="lwk-log-head">
            <span>Week 10</span>
          </div>
          <div className="work-report">
            <Work_Report week={'wk-10'} id={userId}/>
          </div>
        </div>

        <div>
          <div className="lwk-log-head">
            <span>Week 11</span>
          </div>
          <div className="work-report">
            <Work_Report week={'wk-11'} id={userId}/>
          </div>
        </div>

        <div>
          <div className="lwk-log-head">
            <span>Week 12</span>
          </div>
          <div className="work-report">
            <Work_Report week={'wk-12'} id={userId}/>
          </div>
        </div>

        <div>
          <label htmlFor="" className='DptSup' >Departmental Supervisor's Comment</label>
          <textarea className='Sup_comm' name="" id="" cols="30" rows="10" placeholder='Departmental Supervisor Comment ...' value={user[`dept-sup-comment`]} disabled></textarea>
        </div>
        
      </div>

    </div>}
    {!user && <p className='loading'>Loading...</p>}
    </>
  )
}

export default Logbook
