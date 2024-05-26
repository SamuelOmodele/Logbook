import React, { useState, useEffect, useRef } from 'react'
import '../Company_Supervisors/supHome.css'
import '../student_page/company.css'
import supervisorImg from '../../assets/default3.webp'
import { auth } from '../config/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, query, where, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase'
import { v4 } from 'uuid'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { Imagedb } from '../config/firebase'

const DeptSupHome = () => {

    const [user, setUser] = useState(null);
    const profileImgRef = useRef(null);

    const fetchUser_ = async (imageUrl) => {
        onAuthStateChanged(auth, async (userAuth) => {
            if (userAuth) {
                try {
                    const q = query(collection(db, 'DeptSupervisor'), where('email', '==', userAuth.email));
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
            } else {
                console.log('User not logged in');
                // Handle case where user is not logged in (if needed)
            }
        });
    }

    const uploadImage = async (id, imageUrl) => {

        let newData = { image: imageUrl };

        try {
            const docRef = doc(db, 'DeptSupervisor', id);
            await updateDoc(docRef, newData);
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    }

    const handleImageChange = async (e) => {
        const file = e.target.files[0];

        const imgRef = ref(Imagedb, `files/${v4()}`);

        try {
            // Upload the file to Firebase Storage
            await uploadBytes(imgRef, file);

            // Get the download URL of the uploaded image
            const imageUrl = await getDownloadURL(imgRef);

            fetchUser_(imageUrl);

            // Show an alert indicating successful upload
            alert('Image uploaded successfully');
        } catch (error) {

            console.error('Error uploading image:', error);

            alert('Error uploading image. Please try again.');
        }
    }

    const fetchUser = async () => {
        onAuthStateChanged(auth, async (userAuth) => {
            console.log(userAuth)
            if (userAuth) {
                try {
                    const q = query(collection(db, 'DeptSupervisor'), where('email', '==', userAuth.email));
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
            } else {
                console.log('User not logged in');
                // Handle case where user is not logged in (if needed)
            }
        });
    }

    const fetchDocument = async (id) => {
        try {
            const docRef = doc(db, 'DeptSupervisor', id);
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

        fetchUser(); // Call fetchUser directly
    }, []);

    return (
        <>
            {user && <div className='supHome company' style={{ width: '100%' }}>
                <div className='card'>
                    {!user.image && <img src={supervisorImg} alt="" />}
                    {user.image && <img src={user.image} alt="" />}
                    <p className='company-title'>{user.name}</p>
                    <p style={{fontSize: '14px', marginTop: '5px'}}>{`${user.department} Department Supervisor`} </p>

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
                        <input type="file" style={{ display: 'none' }} ref={profileImgRef} onChange={handleImageChange} />
                    </div>

                </div>
            </div>}
            {!user && <p className='loading'>Loading...</p>}
        </>
    )
}

export default DeptSupHome