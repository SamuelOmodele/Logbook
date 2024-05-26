import React, { useState, useEffect } from 'react'
import image from '../../assets/default3.webp'
import styles from '../ViewInterns.module.css'
import '../admin_/Student.css'
import { auth } from '../config/firebase'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { collection, query, where, getDocs, getDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase'
import { useNavigate } from 'react-router-dom'


const OrgSupervisor = () => {

    const [supervisors, setSupervisors] = useState([])
    const [stdsupervisors, setStdSupervisors] = useState([])
    const [add, setAdd] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    const navigate = useNavigate();
    const fetchUser = async () => {
        try {
            const q = query(collection(db, 'OrganizationRecord'), where('email', '==', localStorage.getItem("email")));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    fetchDocument(doc.id);
                });
            } else {
                // console.log("User data not found");
            }
        } catch (error) {
            // console.error("Error fetching user data:", error);
        }
    }

    const fetchDocument = async (id) => {
        try {
            const docRef = doc(db, 'OrganizationRecord', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUser(docSnap.data());
            } else {
                // console.log("Document not found");
            }
        } catch (error) {
            // console.error("Error fetching document:", error);
        }
    }


    const fetchUserSup = async () => {
        try {
            const q = query(collection(db, 'OrgSupervisorRecord'), where('orgEmail', '==', localStorage.getItem("email")));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    fetchDocumentSup(doc.id);
                });
            } else {
                // console.log("User data not found");
            }
        } catch (error) {
            // console.error("Error fetching user data:", error);
        }
    }

    const fetchDocumentSup = async (id) => {
        try {
            const docRef = doc(db, 'OrgSupervisorRecord', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setSupervisors(prevSupervisors => [...prevSupervisors, docSnap.data()]);
            } else {
                console.log("Document not found");
            }
        } catch (error) {
            console.error("Error fetching document:", error);
        }
    }

    useEffect(() => {
        fetchUserSup(); 
        fetchUser();
    }, []);

    useEffect(() => {
        setStdSupervisors(supervisors.filter((item, index, array) => 
            index === array.findIndex(obj => obj.name === item.name)
          ));
    }, [supervisors]);

    const addSupervisors = async(e) => {
        e.preventDefault();

        if (name === '' || email === '' || phone === '') {
            setError('Enter all fields');
        } else {
            try {

                await addDoc(collection(db, 'EntityType'), {
                email: email,
                category: 'org-sup'
                });

                await addDoc(collection(db, 'OrgSupervisorRecord'), {
                name: name,
                email: email,
                phone: phone,
                orgName: user.orgName,
                orgEmail: user.email
                });

                const storedEmail = user.email;
                const storedPassword = localStorage.getItem('password');
                await createUserWithEmailAndPassword(auth, email, 'password');
                await signInWithEmailAndPassword(auth, storedEmail, storedPassword);
                alert('Supervisor Added.')
        
            } catch (err) {
                console.error(err)
            }
        }
    }

    return (
        <>
            {(!add) && <div className="registeredCompany" style={{paddingTop: '20px', paddingBottom: '20px'}}>
                {/* {console.log(stdsupervisors)} */}
                    <div>
                        <div className="title">
                            <span>Industry Based Supervisors</span>
                            <ion-icon name="search-outline" ></ion-icon>
                        </div>
                        <div className={styles.mapCompDetails} style={{ width: '100%'}} >
                            {/* {console.log(stdsupervisors)} */}
                            {stdsupervisors.length === 0 && <p>No Supervisors</p>}

                        {stdsupervisors.map((sup, index) => (
                            <div className={styles.details} key={index}>
                                {!sup?.image && <div className={styles.detImage}><img width='50px' height='50px' src={image} alt="company logo" /></div>}
                                {sup?.image && <div className={styles.detImage}><img width='50px' height='50px' src={sup?.image} alt="company logo" /></div>}
                                <div className={styles.nameDiv}>
                                    <b><span className={styles.StudentName}>{sup.name}</span></b><br />
                                    <span style={{ color: '#777777', fontSize: '13px' }}>{sup.email}</span>
                                </div>
                            </div>
                        
                        ))}
                        </div>
                        <div className="add-btn" onClick={() => setAdd(true)}>
                            <ion-icon name="add-outline"></ion-icon>
                        </div>
                    </div>
            </div>}
            {!supervisors && <p className='loading'>Loading...</p>}
            {add && <div className='registeredCompany'><div className='add-sup' >
                <ion-icon name="arrow-back-outline" onClick={() => setAdd(false)}></ion-icon>
                <h2>Add Supervisors</h2>
                {error && <p className='error' style={{ marginBottom: '10px' }}>{error}</p>}
                <div className="form-row">
                    <label htmlFor="">Supervisor Name</label>
                    <input type="text" name="" id="" placeholder='supervisor name' value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="form-row">
                    <label htmlFor="">Supervisor Email</label>
                    <input type="text" name="" id="" placeholder='supervisor email' value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-row">
                    <label htmlFor="">Supervisor phone number</label>
                    <input type="number" name="" id="" placeholder='supervisor phone number' value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="form-row">
                    <button onClick={addSupervisors}>Add Supervisor</button>
                </div>
                <p style={{color: '#333', fontSize: '11px'}}>On First Login, Supervisors password is "password". They will be required to change it afterwards</p>
            </div></div>}
        </>
    )
}

export default OrgSupervisor