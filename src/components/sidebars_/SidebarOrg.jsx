import React, {useState, useEffect} from 'react'
import './Sidebar.css'
import { Link, useLocation} from 'react-router-dom'
import profileImg from '../../assets/default3.webp'
import logo from '../../assets/E-book logo.png'
import { auth } from '../config/firebase'
import {onAuthStateChanged} from 'firebase/auth'
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase'


const SidebarOrg = () => {

    const location = useLocation();
    const currentPath = location.pathname;

    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            onAuthStateChanged(auth, async (userAuth) => {
                if (userAuth) {
                    try {
                        const q = query(collection(db, 'OrganizationRecord'), where('email', '==', userAuth.email));
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

        fetchUser(); // Call fetchUser directly
    }, []);

  return (
    <nav className="sidebar">

   
        <img style={{width: '100px'}} src={logo} className='imgLogo' alt="" />
    

    <div>
        <Link className='link' to='/org'><li className='sidebar-link active' id={(currentPath === '/org') ? 'active' : ''}><ion-icon name="home-outline"></ion-icon>Home</li></Link>
        <Link className='link' to='/org/supervisors'><li className='sidebar-link' id={(currentPath === '/org/supervisors') ? 'active' : ''}><ion-icon name="person-outline"></ion-icon>Supervisors</li></Link>
        <Link className='link' to='/org/student'><li className='sidebar-link' id={(currentPath === '/org/student') ? 'active' : ''}><ion-icon name="people-outline"></ion-icon>Students</li></Link>
        <Link className='link' to='/auth/sign-in'><li className='sidebar-link'><ion-icon name="log-out-outline"></ion-icon> Logout</li></Link>
        {user && <li className='profile'>
            <Link className='profile_' to='#'>
                <div style={{ height: '3rem', width: '3rem' }} className="profile-img">
                    {!user.image && <img style={{ width: '100%' }} src={profileImg} alt="" />}
                    {user.image && <img style={{ width: '100%' }} src={user.image} alt="" />}
                </div>
                <div className="profile-details" >
                    <span style={{fontFamily:'poppins'}}><b>{user.orgName}</b></span>
                    <span className="btm-span">
                        <span style={{fontFamily:'poppins'}}>Organization</span>
                        
                    </span>
                </div>
            </Link>
        </li>}
        

    </div>


    </nav>
    
    
  )
}

export default SidebarOrg