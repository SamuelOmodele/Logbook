import React, {useState, useEffect} from 'react'
import image from '../../assets/default3.webp'
import styles from '../ViewInterns.module.css'
import '../admin_/Student.css'
import { auth } from '../config/firebase'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { collection, query, where, getDocs, getDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase'


const OrgStudent = () => {

    const [student, setStudent] = useState([])
    const [uniqueStudent, setUniqueStudent] = useState([])
    const [supervisor, setSupervisor] = useState([])
    const [uniqueSupervisor, setUniqueSupervisor] = useState([])
    const [assign, setAssign] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [supName, setSupName] = useState('');
    const [supEmail, setSupEmail] = useState('');
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    

    const fetchUser = async () => {
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
            console.error("Error fetching user data1:", error);
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
            }
        } catch (error) {
            console.error("Error fetching document:", error);
        }
    }


    const fetchUserStd = async () => {
        try {
            const q = query(collection(db, 'StudentRecord'), where('orgEmail', '==', localStorage.getItem("email")));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    fetchDocumentStd(doc.id);
                });
            } else {
                console.log("User data not found");
            }
        } catch (error) {
            console.error("Error fetching user data2:", error);
        }
    }

    const fetchDocumentStd = async (id) => {
        try {
            const docRef = doc(db, 'StudentRecord', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setStudent(prevSupervisors => [...prevSupervisors, docSnap.data()]);
            } else {
                console.log("Document not found");
            }
        } catch (error) {
            console.error("Error fetching document:", error);
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
                console.log("User data not found");
            }
        } catch (error) {
            console.error("Error fetching user data2:", error);
        }
            
    }


    const fetchDocumentSup = async (id) => {
        try {
            const docRef = doc(db, 'OrgSupervisorRecord', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setSupervisor(prevSupervisors => [...prevSupervisors, docSnap.data()]);
            } else {
                console.log("Document not found2");
            }
        } catch (error) {
            console.error("Error fetching document:", error);
        }
    }

    useEffect(() => {
        fetchUserStd(); 
        fetchUser();
        fetchUserSup();
    }, []);

    useEffect(() => {
        setUniqueStudent(student.filter((item, index, array) => 
            index === array.findIndex(obj => obj.name === item.name)
          ));
    }, [student]);

    useEffect(() => {
        setUniqueSupervisor(supervisor.filter((item, index, array) => 
            index === array.findIndex(obj => obj.name === item.name)
          ));
    }, [supervisor]);


    const updateStudentSupervisor = async(id) => {
        let newData = {
            supervisorName: supName, 
            supervisorEmail: supEmail
        };

        try{
            const docRef = doc(db, 'StudentRecord', id);
            await updateDoc(docRef, newData);
            console.log('Supervisor Assigned Successfully')
            alert('Supervisor Assigned Successfully')
        }catch(err) {
            console.error(err);
        }
    }

    const AssignSupervisors = async() => {
        console.log('assign supervisors');
        if (supName === ''){
            alert('Choose a supervisor')
        } else {

                try {
                    const q = query(collection(db, 'StudentRecord'), where('email', '==', email));
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        querySnapshot.forEach((doc) => {
                            console.log(doc.id);
                            updateStudentSupervisor(doc.id)
                        });
                    } else {
                        console.log("User data not found");
                    }
                } catch (error) {
                    console.error("Error fetching user data2:", error);
                }
            
        }
    }

  return (
      <>
          {!assign && <div className="registeredCompany" style={{paddingTop: '20px', paddingBottom: '20px', overflowX: 'hidden'}}>


              <div className="title" style={{width: '480px'}}>
                  <span>Students </span>
                  <ion-icon name="search-outline" ></ion-icon>
              </div>

              <div className={styles.mapCompDetails} >
                  {
                      uniqueStudent.map((det, index) => (
                          <div className={styles.details} key={index} style={{width: '480px'}} >
                              {!det.image && <div className={styles.detImage}><img width='50px' height='50px' src={image} alt="company logo" /></div>}
                              {det.image && <div className={styles.detImage}><img width='50px' height='50px' src={det.image} alt="company logo" /></div>}
                              <div className={styles.nameDiv}>
                                  <b><span className={styles.StudentName}>{det.name}</span></b><br />
                                  <span style={{ color: '#777777', fontSize: '13px' }}>{det.department} {det.supervisorName ? `| Supervisor: ${det.supervisorName}` : ''}</span>
                              </div>
                              <div className="assign-text" onClick={() => {setAssign(true); setName(det.name); setEmail(det.email)}}>Assign</div>
                          </div>
                      ))
                  }
                  {uniqueStudent.length === 0 && <p>No Student</p>}
              </div>



          </div>}
          {assign && <div className='registeredCompany'><div className='add-sup' >
                <ion-icon name="arrow-back-outline" onClick={() => setAssign(false)}></ion-icon>
                <h2>Assign Supervisors</h2>
                {error && <p className='error' style={{ marginBottom: '10px' }}>{error}</p>}
                <div className="form-row">
                    <label htmlFor="">Student Name</label>
                    <input type="text" name="" id="" placeholder='student name' value={name} disabled/>
                </div>
                <div className="form-row">
                    <label htmlFor="">Supervisor Name</label>
                    <select value={supName} onChange={(e) => {setSupName(e.target.value); const result = uniqueSupervisor.find(item => item.name === e.target.value); setSupEmail(result.email)}}>
                    <option value=''>-- Select --</option>
                        {uniqueSupervisor.map((sup, index) => (
                            <option value={sup.name} key={index}>{sup.name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-row">
                    <label htmlFor="">Supervisor Email</label>
                    <input type="text" value={supEmail} disabled/>
                </div>
                <div className="form-row">
                    <button onClick={AssignSupervisors}>Assign Supervisor</button>
                </div>
            </div></div>}
      </>
  )
}

export default OrgStudent