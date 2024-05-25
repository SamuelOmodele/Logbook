import React, { useEffect, useState } from 'react'
import profile from '../../assets/University-of-Ibadan.jpg'
import styles from '../ViewInterns.module.css'
import './Student.css'
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';



const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState('');
  const [add, setAdd] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('');


  // Function to fetch all documents from a collection
  const getAllDocuments = async (collectionName) => {
    try {
      const collectionRef = collection(db, collectionName);
      const querySnapshot = await getDocs(collectionRef);

      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data()
      }));

      return documents;
    } catch (error) {
      setLoading(false);
      console.error('Error fetching documents:', error);
      throw error;
    }
  };

  // --- get all the departments from the database
  useEffect(() => {
    getAllDocuments('Department')
      .then((documents) => {
        setDepartments(documents);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, [])

  // --- add department
  const addDepartment = async(e) => {
    e.preventDefault();

    if (departmentName === '') {
        setError('Enter department name');
    } else {
        try {
            await addDoc(collection(db, 'Department'), {
            name: departmentName
            });
            alert('Department Added')
            window.location.reload()
    
        } catch (err) {
            console.error(err)
        }
    }
}

    
  return (
    <div className='Student'>
      {loading === false ? 
      <>
      {!add && <div className={styles.mapCompDetails} style={{width:'100%'}}>
        <div className="title">
        <span>Departments</span>
        <ion-icon name="search-outline" ></ion-icon>
      </div>
        {departments.length === 0 && <p >No departments</p>}
        {
          departments?.map((det, index) => (
            <div className={styles.details} key={index}>
              <div className={styles.detImage}><img width='50px' height='45px' src={profile} /></div>
              <div className={styles.nameDiv}>
                <b><span className={styles.StudentName}>{det.data.name}</span></b>
              </div>
            </div>
          ))
        }
      </div>}
      {add && <div className='add-sup' style={{width: '100%'}}>
          <ion-icon name="arrow-back-outline" onClick={() => setAdd(false)} style={{left: '0', top: '25px'}}></ion-icon>
          <h2>Add Departments</h2>
          {error !== '' && <p className='error'>{error}</p>}
          <div className="form-row">
              <label htmlFor="">Department Name</label>
              <input type="text" name="" id="" placeholder='Enter Department' value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} />
          </div>
          <div className="form-row">
              <button onClick={addDepartment}>Add Department</button>
          </div>
      </div>}
      </>: 
      <p style={{marginTop: '20px'}}>Loading...</p>}

      <div className="add-btn" onClick={() => setAdd(true)}>
          <ion-icon name="add-outline"></ion-icon>
      </div>

    </div>
  )
}

export default Department
