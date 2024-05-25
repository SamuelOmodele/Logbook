import React, { useState, useEffect } from 'react'
import profile from '../../assets/default3.webp'
import styles from '../ViewInterns.module.css'
import './Student.css'
import { auth } from '../config/firebase'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { collection, query, where, getDocs, getDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase'
import { useNavigate } from 'react-router-dom'


const ViewDeptSupervisors = () => {
    const [deptSupervisor, setDeptSupervisor] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [loading, setLoading] = useState(null);
    const [add, setAdd] = useState(null);
    const [error, setError] = useState('');

    const [supName, setSupName] = useState('');
    const [supEmail, setSupEmail] = useState('');
    const [supPhone, setSupPhone] = useState('');
    const [supDept, setSupDept] = useState('');
    const [userEmail, setUserEmail] = useState();
    const navigate = useNavigate();


    // Function to fetch all documents from a collection
    const getAllDocuments = async (collectionName) => {
        try {
            // Reference to the collection
            const collectionRef = collection(db, collectionName);

            // Retrieve all documents from the collection
            const querySnapshot = await getDocs(collectionRef);

            // Extract data from each document
            const documents = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data()
            }));

            // Return the array of documents
            return documents;
        } catch (error) {
            setLoading(false);
            console.error('Error fetching documents:', error);
            throw error; // Rethrow the error to handle it in the calling code
        }
    };

    useEffect(() => {
        setUserEmail(localStorage.getItem('email'))

        // Usage example
        getAllDocuments('DeptSupervisor')
            .then((documents) => {
                setDeptSupervisor(documents);
                setLoading(false);
            })
            .catch((error) => {
                // Handle any errors that occur during the fetching process
                console.error('Error:', error);
                setLoading(false);
            });

        // Usage example
        getAllDocuments('Department')
            .then((documents) => {
                setDepartmentList(documents);
                setLoading(false);
            })
            .catch((error) => {
                // Handle any errors that occur during the fetching process
                console.error('Error:', error);
                setLoading(false);
            });
    }, [])

    const addDeptSup = async(e) => {
        e.preventDefault();
    
        if (supName === '' || supEmail === '' || supPhone === '' || supDept === '') {
            setError('Please Fill all fields');
        } else {
            try {

                await addDoc(collection(db, 'EntityType'), {
                    email: supEmail,
                    category: 'dept-sup'
                });
    
                await addDoc(collection(db, 'DeptSupervisor'), {
                name: supName,
                email: supEmail,
                phone: supPhone, 
                department: supDept
                });
                let storedEmail = userEmail;
                let storedPassword = localStorage.getItem('password');
                console.log(storedEmail, storedPassword)
                
                alert('Department Supervisor Added.');
                await createUserWithEmailAndPassword(auth, supEmail, 'password');
                await signInWithEmailAndPassword(auth, storedEmail, storedPassword);
                window.location.reload();
            } catch (err) {
                console.error(err)
            }
        }

    }

    return (
        <div className="registeredCompany" style={{ paddingTop: '20px', paddingBottom: '20px' }}>

            {loading === false ?
                <>
                    {!add && <div className={styles.mapCompDetails} style={{ width: '100%' }}>
                        <div className="title">
                            <span>Department Supervisors</span>
                            <ion-icon name="search-outline" ></ion-icon>
                        </div>
                        {deptSupervisor.length === 0 && <p >No departments supervisors</p>}
                        {
                            deptSupervisor?.map((det, index) => (
                                <div className={styles.details} key={index}>
                                    {!det.data.image && <div className={styles.detImage}><img width='50px' height='45px' src={profile} /></div>}
                                    {det.data.image && <div className={styles.detImage}><img width='50px' height='45px' src={det.data.image} /></div>}
                                    <div className={styles.nameDiv}>
                                        <b><span className={styles.StudentName}>{det.data.name}</span></b><br />
                                        <span style={{ color: '#777777', fontSize: '13px' }}>{det.data.email}</span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>}
                    {add && <div className='add-sup' style={{ width: '100%' }}>
                        <ion-icon name="arrow-back-outline" onClick={() => setAdd(false)} style={{ left: '0', top: '25px' }}></ion-icon>
                        <h2>Add Supervisors</h2>
                        {error !== '' && <p className='error'>{error}</p>}
                        <div className="form-row">
                            <label htmlFor="">Supervisor Name</label>
                            <input type="text" name="" id="" placeholder='Enter Supervisor Name'  value={supName} onChange={(e) => setSupName(e.target.value)}/>
                        </div>
                        <div className="form-row">
                            <label htmlFor="">Supervisor Email</label>
                            <input type="text" name="" id="" placeholder='Enter Supervisor Email' value={supEmail} onChange={(e) => setSupEmail(e.target.value)} />
                        </div>
                        <div className="form-row">
                            <label htmlFor="">Supervisor Contact</label>
                            <input type="number" name="" id="" placeholder='Enter Supervisor Contact' value={supPhone} onChange={(e) => setSupPhone(e.target.value)} />
                        </div>
                        <div className="form-row">
                            <label htmlFor="">Supervisor Department</label>
                            <select name="" id="" value={supDept} onChange={(e) => setSupDept(e.target.value)}>
                                <option value=''>-- Select --</option>
                                {departmentList?.map((dept, index) => (
                                    <option value={dept.data.name} key={index}>{dept.data.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-row">
                            <button onClick={addDeptSup}>Add Supervisor</button>
                            <p style={{color: '#333', fontSize: '11px'}}>On First Login, Supervisors password is "password". They will be required to change it afterwards</p>
                        </div>
                    </div>}
                </> :
                <p style={{ marginTop: '20px' }}>Loading...</p>}

            <div className="add-btn" onClick={() => setAdd(true)}>
                <ion-icon name="add-outline"></ion-icon>
            </div>



        </div>
    )
}

export default ViewDeptSupervisors

