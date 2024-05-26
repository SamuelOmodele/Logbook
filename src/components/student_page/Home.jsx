import React, { useEffect, useRef, useState } from 'react'
import './Home.css'
import pdfImg from '../../assets/pdf.png'
import studentImg from '../../assets/default3.webp'
import { auth } from '../config/firebase'
import {onAuthStateChanged} from 'firebase/auth'
import { collection, query, where, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase'
import { Imagedb } from '../config/firebase'
import { v4 } from 'uuid'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useNavigate } from 'react-router-dom'


const Home = () => {

    const [user, setUser] = useState(null);
    const profileImgRef = useRef(null)
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const q = query(collection(db, 'StudentRecord'), where('email', '==', localStorage.getItem("email")));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    querySnapshot.forEach((doc) => {
                        fetchDocument(doc.id);
                    });
                } else {
                    console.log("User data not found");
                    navigate('/auth/sign-in');
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                // Handle error appropriately (e.g., show error message to user)
            }
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

    const fetchUser_ = async (imageUrl) => {
        onAuthStateChanged(auth, async (userAuth) => {
            if (userAuth) {
                try {
                    const q = query(collection(db, 'StudentRecord'), where('email', '==', userAuth.email));
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

    const uploadImage = async(id, imageUrl) => {

        let newData = {image: imageUrl};

        try{
            const docRef = doc(db, 'StudentRecord', id);
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

            fetchUser_(imageUrl);
    
            // Show an alert indicating successful upload
            alert('Image uploaded successfully');
        } catch (error) {

            console.error('Error uploading image:', error);

            alert('Error uploading image. Please try again.');
        }
    }

    return (
        <>
        {user && <div className='Home'>
            {localStorage.setItem('orgEmail', user.orgEmail)}

            <div className="home-container">
                <div className="hm-image">
                    {!user.image && <img src={studentImg} alt=""/>}
                    {user.image && <img src={user.image} alt=""/>}
                </div>
                <div className="stu-details">
                    <span className="name"><b>{user?.name}</b></span>
                    <span className="matricNo">{user?.matricNo}</span>
                    <span className="matricNo">{user?.department}</span>
                </div>
                <div className="stu-contact">
                    <div className="email contact">
                        <span className='contact-icon'><ion-icon  name="mail-outline"></ion-icon></span>
                        <span  className="emailAddress">{user?.email}</span>
                    </div>
                    <div className="phone contact">
                        <span className='contact-icon'><ion-icon name="call-outline"></ion-icon></span>
                        <span className="emailAddress">{user?.phone}</span>
                    </div>
                </div>
                <div className="stu-doc">
                    <span className="docHead">Documents</span>
                    <div className="docFiles">
                        <div className="doc-1">
                            <img src={pdfImg} alt="img" />
                            <span className="docFileName">Job Reporting Form.pdf</span>
                        </div>
                        <div className="doc-1">
                            <img src={pdfImg} alt="img" />
                            <span className="docFileName">Employers Evaluation Form.pdf</span>
                        </div>
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

export default Home
