import React, { useEffect, useRef, useState } from 'react'
import company from '../../assets/default3.webp'
import '../student_page/company.css'
import { auth } from '../config/firebase'
import {onAuthStateChanged} from 'firebase/auth'
import { collection, query, where, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase'
import { v4 } from 'uuid'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { Imagedb } from '../config/firebase'

const OrgHome = () => {

  const [user, setUser] = useState(null);
  const profileImgRef = useRef(null);

  const UpdateImage = async (imageUrl) => {
    try {
        const q = query(collection(db, 'OrganizationRecord'), where('email', '==', localStorage.getItem('email')));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                uploadImage(doc.id, imageUrl)
            });
        } else {
            console.log("User data not found");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle error appropriately (e.g., show error message to user)
    }
}

const uploadImage = async(id, imageUrl) => {

    let newData = {image: imageUrl};

    try{
        const docRef = doc(db, 'OrganizationRecord', id);
        await updateDoc(docRef, newData);
        window.location.reload();
    }catch(err) {
        console.error(err);
    }
}

const handleImageChange = async(e) => {
    const file = e.target.files[0];

    const imgRef = ref(Imagedb, `files/${v4()}`);

    try {
        // Upload the file to Firebase Storage
        await uploadBytes(imgRef, file);

        // Get the download URL of the uploaded image
        const imageUrl = await getDownloadURL(imgRef);

        UpdateImage(imageUrl);

        // Show an alert indicating successful upload
        alert('Image uploaded successfully');
    } catch (error) {

        console.error('Error uploading image:', error);

        alert('Error uploading image. Please try again.');
    }
}

  const fetchUser = async () => {
    console.log(localStorage.getItem("email"));
    console.log('hi')
        try {
          const q = query(collection(db, 'OrganizationRecord'), where('email', '==', localStorage.getItem("email")));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              fetchDocument(doc.id);
            });
          } else {
            console.log("User data not found");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Handle error appropriately (e.g., show error message to user)
        }
  }

  const fetchDocument = async (id) => {
    try {
      const docRef = doc(db, 'OrganizationRecord', id);
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

  useEffect(() => {
    console.log('hi')
    fetchUser(); // Call fetchUser directly
  }, []);

  return (
    <>
      { user && <div className='orgHome company'>
        {console.log(user)}
        <div className='card'>
          {!user.image && <img src={company} alt="" />}
          {user.image && <img src={user.image} alt="" />}
          <p className='company-title'>{user.orgName}</p>
          <p>{user.address}</p>

          <div className="stu-contact">
            <div className="email contact">
              <span style={{ backgroundColor: '#0066FF80', borderRadius: '50%' }} className='contact-icon'><ion-icon name="mail-outline"></ion-icon></span>
              <span className="emailAddress">{user.email} </span>
            </div>
            <div className="phone contact">
              <span style={{ backgroundColor: '#0066FF80', borderRadius: '50%' }} className='contact-icon'><ion-icon name="call-outline"></ion-icon></span>
              <span className="emailAddress">{user.phone}</span>
            </div>
          </div>
          <div className="hm-btn">
              <button className="btn" onClick={() => profileImgRef.current.click()}>Edit Profile Image</button>
              <input type="file" style={{display: 'none'}} ref={profileImgRef} onChange={handleImageChange}/>
          </div>

        </div>
      </div>}
      {!user && <p className='loading'>Loading...</p>}
    </>
    
  )
}

export default OrgHome

