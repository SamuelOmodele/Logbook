import React, { useState, useEffect } from 'react'
import '../Company_Supervisors/supervisorStudent.css'
import styles from '../ViewInterns.module.css'
import '../admin_/Student.css'
import Work_Report from '../student_page/Work_Report'
import defaultImg from '../../assets/default3.webp'
import { auth } from '../config/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, query, where, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase'


const DeptSupStudent = () => {

  const [all, setAll] = useState(true)
  const [user, setUser] = useState(null)
  const [studentDetails, setStudentDetails] = useState([]);
  const [uniqueStudentDetails, setUniqueStudentDetails] = useState([])
  const [exist, setExist] = useState(false);
  const [loading, setLoading] = useState('Loading..');
  const [currentStudent, setCurrentStudent] = useState('');
  const [userId, setUserId] = useState('')
  const [deptSupComment, setDeptSupComment] = useState('');


  const fetchUser = async () => {
    onAuthStateChanged(auth, async (userAuth) => {
      console.log(userAuth)
      console.log(user)
      if (user) {
        try {
          const q = query(collection(db, 'StudentRecord'), where('department', '==', user.department));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              fetchDocument(doc.id);
              console.log('Ids')
              console.log(doc.id)
            });
          } else {
            console.log("User data not found");
            setLoading('No student has been assigned under you')
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
        setStudentDetails(prevSupervisors => [...prevSupervisors, { id: id, data: docSnap.data() }]);
        setExist(true);
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
  }, [user]);

  const fetchUserSup = async () => {
    onAuthStateChanged(auth, async (userAuth) => {
      console.log(userAuth)
      if (userAuth) {
        try {
          const q = query(collection(db, 'DeptSupervisor'), where('email', '==', userAuth.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              fetchDocumentSup(doc.id);
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

  const fetchDocumentSup = async (id) => {
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

    fetchUserSup(); // Call fetchUser directly
  }, []);

  useEffect(() => {
    console.log('studentDetails')
    console.log(studentDetails)
    if (studentDetails) {
      setUniqueStudentDetails(studentDetails.filter((item, index, array) =>
        index === array.findIndex(obj => obj.id === item.id)
      ));
    }

  }, [studentDetails]);

  const saveDeptSupComment = async (e) => {

    e.preventDefault();

    if (deptSupComment === '') {
      alert(`Please write a comment`)
    } else {
      const newData = {
        [`dept-sup-comment`]: deptSupComment,
      };

      try {
        const docRef = doc(db, 'StudentRecord', userId);
        await updateDoc(docRef, newData);
        console.log('updated successful');
        alert('updated successful');
      } catch (err) {
        console.error(err);
      }
      console.log('hi')
    }


  }
  return (
    <>
      {(all && exist) &&
        <div className="registeredCompany" style={{ paddingTop: '20px', paddingBottom: '20px' }}>


          <div className="title">
            <span>Students </span>
            <ion-icon name="search-outline" ></ion-icon>
          </div>
          {console.log(uniqueStudentDetails)}

          <div className={styles.mapCompDetails} style={{ width: '100%' }}>
            {
              uniqueStudentDetails.map((det, index) => (
                <div className={styles.details} key={index}>
                  {!det.data.image && <div className={styles.detImage}><img width='50px' height='50px' src={defaultImg} alt="company logo" /></div>}
                  {det.data.image && <div className={styles.detImage}><img width='50px' height='50px' src={det.data.image} alt="company logo" /></div>}
                  <div className={styles.nameDiv}>
                    <b><span className={styles.StudentName}>{det.data.name}</span></b><br />
                    <span style={{ color: '#777777', fontSize: '13px' }}>{det.data.department}</span>
                  </div>
                  <div className="circle" onClick={() => { setAll(false); setCurrentStudent(det.data); setUserId(det.id) }}><ion-icon name="arrow-forward-outline" ></ion-icon></div>
                </div>
              ))
            }
          </div>



        </div>}

      {!exist && <p style={{ margin: '20px' }}>{loading}</p>}

      {!all && <div className="student-logbook registeredCompany" style={{ paddingTop: '20px', paddingBottom: '20px' }}>

        <div className="title" style={{ width: '300px' }}>
          <ion-icon name="arrow-back-outline" onClick={() => setAll(true)} style={{ cursor: 'pointer' }}></ion-icon>
          <span>{currentStudent.name}</span>

        </div>
        <div className="week-1">
          <div className="lwk-log-head">
            <span style={{ marginTop: '15px', fontSize: '15px' }}>Week 1</span>
          </div>
          <div className="work-report">
            <Work_Report week={'wk-1'} id={userId} entity={'org-sup'} dept_sup={true} />
          </div>
        </div>
        <div className="week-1">
          <div className="lwk-log-head">
            <span style={{ marginTop: '15px', fontSize: '15px' }}>Week 2</span>
          </div>
          <div className="work-report">
            <Work_Report week={'wk-2'} id={userId} entity={'org-sup'} dept_sup={true} />
          </div>
        </div>
        <div className="week-1">
          <div className="lwk-log-head">
            <span style={{ marginTop: '15px', fontSize: '15px' }}>Week 3</span>
          </div>
          <div className="work-report">
            <Work_Report week={'wk-3'} id={userId} entity={'org-sup'} dept_sup={true} />
          </div>
        </div>
        <div className="week-1">
          <div className="lwk-log-head">
            <span style={{ marginTop: '15px', fontSize: '15px' }}>Week 4</span>
          </div>
          <div className="work-report">
            <Work_Report week={'wk-4'} id={userId} entity={'org-sup'} dept_sup={true} />
          </div>
        </div>
        <div className="week-1">
          <div className="lwk-log-head">
            <span style={{ marginTop: '15px', fontSize: '15px' }}>Week 5</span>
          </div>
          <div className="work-report">
            <Work_Report week={'wk-5'} id={userId} entity={'org-sup'} dept_sup={true} />
          </div>
        </div>
        <div className="week-1">
          <div className="lwk-log-head">
            <span style={{ marginTop: '15px', fontSize: '15px' }}>Week 6</span>
          </div>
          <div className="work-report">
            <Work_Report week={'wk-6'} id={userId} entity={'org-sup'} dept_sup={true} />
          </div>
        </div>
        <div className="week-1">
          <div className="lwk-log-head">
            <span style={{ marginTop: '15px', fontSize: '15px' }}>Week 7</span>
          </div>
          <div className="work-report">
            <Work_Report week={'wk-7'} id={userId} entity={'org-sup'} dept_sup={true} />
          </div>
        </div>
        <div className="week-1">
          <div className="lwk-log-head">
            <span style={{ marginTop: '15px', fontSize: '15px' }}>Week 8</span>
          </div>
          <div className="work-report">
            <Work_Report week={'wk-8'} id={userId} entity={'org-sup'} dept_sup={true} />
          </div>
        </div>
        <div className="week-1">
          <div className="lwk-log-head">
            <span style={{ marginTop: '15px', fontSize: '15px' }}>Week 9</span>
          </div>
          <div className="work-report">
            <Work_Report week={'wk-9'} id={userId} entity={'org-sup'} dept_sup={true} />
          </div>
        </div>
        <div className="week-1">
          <div className="lwk-log-head">
            <span style={{ marginTop: '15px', fontSize: '15px' }}>Week 10</span>
          </div>
          <div className="work-report">
            <Work_Report week={'wk-10'} id={userId} entity={'org-sup'} dept_sup={true} />
          </div>
        </div>
        <div className="week-1">
          <div className="lwk-log-head">
            <span style={{ marginTop: '15px', fontSize: '15px' }}>Week 11</span>
          </div>
          <div className="work-report">
            <Work_Report week={'wk-11'} id={userId} entity={'org-sup'} dept_sup={true} />
          </div>
        </div>
        <div className="week-1">
          <div className="lwk-log-head">
            <span style={{ marginTop: '15px', fontSize: '15px' }}>Week 12</span>
          </div>
          <div className="work-report">
            <Work_Report week={'wk-12'} id={userId} entity={'org-sup'} dept_sup={true} />
          </div>
        </div>
        <div className="week-1">
          <label htmlFor="" className='DptSup' style={{ displa: 'block', marginTop: '20px' }}>Departmental Supervisor's Comment</label>
          <textarea className='Sup_comm' name="" id="" cols="30" rows="10" placeholder='Departmental Supervisor Comment ...' defaultValue={currentStudent[`dept-sup-comment`]} onChange={(e) => setDeptSupComment(e.target.value)}></textarea>
          <button type='submit' className="btn" style={{ width: '30%', marginLeft: '70%' }} onClick={saveDeptSupComment}>Save</button>
        </div>
      </div>}


    </>
  )
}

export default DeptSupStudent