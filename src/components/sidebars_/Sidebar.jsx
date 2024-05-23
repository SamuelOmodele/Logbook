import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import studentImg from '../../assets/default3.webp'
import './Sidebar.css'
import logo from '../../assets/E-book logo.png'
import { useLocation } from 'react-router-dom';
import { auth } from '../config/firebase'
import {onAuthStateChanged} from 'firebase/auth'
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase'


const Sidebar = () => {

    const location = useLocation();
    const currentPath = location.pathname;

    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            onAuthStateChanged(auth, async (userAuth) => {
                if (userAuth) {
                    try {
                        const q = query(collection(db, 'StudentRecord'), where('email', '==', userAuth.email));
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
        <div className='sidebar'>
            <nav>
                
                <Link to='/'>
                    <img style={{width: '100px'}} src={logo} className='imgLogo' alt="" />
                </Link>

                <div>
                    <Link className='link' to='/'><li className='sidebar-link' id={(currentPath === '/') ? 'active' : ''}><ion-icon name="home-outline"></ion-icon> Home</li></Link>
                    <Link className='link' to='/logbook'><li className='sidebar-link' id={(currentPath === '/logbook') ? 'active' : ''}><ion-icon name="newspaper-outline"></ion-icon> Log Book</li></Link>
                    <Link className='link' to='/company'><li className='sidebar-link' id={(currentPath === '/company') ? 'active' : ''}><ion-icon name="people-outline"></ion-icon> Company</li></Link>
                    <Link className='link' to='/auth/sign-in' ><li className='sidebar-link'><ion-icon name="log-out-outline"></ion-icon> Logout</li></Link>

                    <li className='profile'>
                        {user && <Link className='profile_' to='#'>
                            <div className="profile-img">
                                {!user.image && <img style={{ width: '100%' }} src={studentImg} alt="" />}
                                {user.image && <img style={{ width: '100%' }} src={user.image} alt="" />}
                            </div>
                            <div className="profile-details">
                                <span style={{fontFamily:'poppins'}}><b>{user?.name}</b></span>
                                <span className="btm-span">
                                    <span style={{fontFamily:'poppins'}}>{user?.department}</span>
                                </span>
                            </div>
                        </Link>}
                    </li>

                </div>

            </nav>

        </div>
    )
}

export default Sidebar
