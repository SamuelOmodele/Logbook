import React, { useState, useEffect } from 'react'
import company from '../../assets/default3.webp'
import './company.css'
import { auth } from '../config/firebase'
import {onAuthStateChanged} from 'firebase/auth'
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase'


const Company = () => {

  const [companyDetails, setCompanyDetails] = useState(null);
  const [exist, setExist] = useState(true);
  const orgEmail = localStorage.getItem('orgEmail');

  const fetchUser = async () => {
    onAuthStateChanged(auth, async (userAuth) => {
      console.log(userAuth)
      if (userAuth) {
        try {
          
          console.log(orgEmail)
          const q = query(collection(db, 'OrganizationRecord'), where('email', '==', orgEmail));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              fetchDocument(doc.id);
            });
          } else {
            console.log("User data not found");
            setExist(false)
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
      const docRef = doc(db, 'OrganizationRecord', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCompanyDetails(docSnap.data())
      } else {
        console.log("Document not found");
        // Handle case where document does not exist (if needed)
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      // Handle error appropriately (e.g., show error message to user)
    }
  }

  useEffect(() => {

    fetchUser(); // Call fetchUser directly
  }, []);

  return (
    <>
      {companyDetails && <div className='company'>
            <div className='card'>
              {!companyDetails.image && <img src={company} alt="" />}
              {companyDetails.image && <img src={companyDetails.image} alt="" />}
              <p className='company-title'>{companyDetails.orgName}</p>
              <p>{companyDetails.address}</p>

              <div className="stu-contact">
                <div className="email contact">
                  <span style={{ backgroundColor: '#0066FF80', borderRadius: '50%' }} className='contact-icon'><ion-icon name="mail-outline"></ion-icon></span>
                  <span className="emailAddress">{companyDetails.email} </span>
                </div>
                <div className="phone contact">
                  <span style={{ backgroundColor: '#0066FF80', borderRadius: '50%' }} className='contact-icon'><ion-icon name="call-outline"></ion-icon></span>
                  <span className="emailAddress">{companyDetails.phone}</span>
                </div>
              </div>

            </div>

      </div>}
      {(!companyDetails && exist) && <p className='loading'>Loading...</p>}
      {(!companyDetails && !exist) && <p style={{marginLeft: '100px', marginTop: '50px'}}>This organization <b>{orgEmail}</b> is not registered.</p>}
    </>
  )
}

export default Company