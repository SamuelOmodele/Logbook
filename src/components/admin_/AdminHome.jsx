import React, { useEffect, useState } from 'react'
import './adminHome.css'
import { collection, getDocs } from 'firebase/firestore';
import defaultImg from '../../assets/default3.webp'
import { db } from '../config/firebase';
import styles from '../ViewInterns.module.css'

const AdminHome = () => {

  const [companyList, setCompanyList] = useState([])
  const [companySet, setCompanySet] = useState(false)
  const [orgSupList, setOrgSupList] = useState([])
  const [orgSupSet, setOrgSupSet] = useState(false)
  const [deptSupList, setDeptSupList] = useState([])
  const [deptSupSet, setDeptSupSet] = useState(false)
  const [studentList, setStudentList] = useState([])
  const [studentSet, setStudentSet] = useState(false)
  const [activeList, setActiveList] = useState(null);
  const [overview, setOverview] = useState(true)
  const [heading, setHeading] = useState(true)


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
    console.error('Error fetching documents:', error);
    throw error;
  }
};

  // -- get all the entities from the database ---
  useEffect(() => {
    getAllDocuments('OrganizationRecord')
      .then((documents) => {
        setCompanyList(documents);
        setCompanySet(true)
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    getAllDocuments('OrgSupervisorRecord')
      .then((documents) => {
        setOrgSupList(documents);
        setOrgSupSet(true)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    getAllDocuments('StudentRecord')
      .then((documents) => {
        setStudentList(documents);
        setStudentSet(true)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    getAllDocuments('DeptSupervisor')
      .then((documents) => {
        setDeptSupList(documents);
        setDeptSupSet(true)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [])

  
  return (
    <div className= 'admin_home_view'>
      <div><span className="heading">Overview</span>
        </div>
      {(overview && companySet && deptSupSet && studentSet && orgSupSet) && <div className= "admin_content">
        
        <div className= "admin_card">
          <span className="title" style={{width: '100%'}}>Department Supervisors</span>
          <span className="name">{deptSupList?.length} departmental supervisors</span>
          <button className='btn' onClick={() => {setActiveList(deptSupList); setOverview(false); setHeading('Department Supervisors')}}>View All</button>
        </div>
        <div className= "admin_card">
          <span className="title" style={{width: '100%'}}>Company</span>
          <span className="name">{companyList?.length} Registered company</span>
          <button className='btn' onClick={() => {setActiveList(companyList); setOverview(false); setHeading('Registered Company')}}>View All</button>
        </div>
        <div className= "admin_card">
          <span className="title" style={{width: '100%'}}>Industry Based Supervisors</span>
          <span className="name">{orgSupList?.length} Industry Based Supervisors</span>
          <button className='btn' onClick={() => {setActiveList(orgSupList); setOverview(false) ; setHeading('Industry Based Supervisors')}}>View All</button>
        </div>
        <div className= "admin_card">
          <span className="title" style={{width: '100%'}}>Students</span>
          <span className="name">{studentList?.length} Students</span>
          <button className='btn' onClick={() => {setActiveList(studentList); setOverview(false); setHeading('Students')}}>View All</button>
        </div>
      </div>}
      { overview && !( companySet && deptSupSet && studentSet && orgSupSet) && <p>Loading....</p>}
    

      {!overview && activeList && <div className={styles.mapCompDetails} style={{width:'100%', paddingTop: '0px'}}>
      <div style={{fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '35px', marginBottom: '10px'}}><ion-icon name="arrow-back-outline" onClick={() => setOverview(true)} style={{cursor: 'pointer'}}></ion-icon> {heading}</div>
      {activeList.length === 0 && <p>No data . . .</p>}
        {
          activeList?.map((item, index) => (
            <div className={styles.details} key={index} >
              {!item.data.image && <div className={styles.detImage}><img width='50px' height='50px' src={defaultImg} alt="company logo" /></div>}
              {item.data.image && <div className={styles.detImage}><img width='50px' height='50px' src={item.data.image} alt="company logo" /></div>}
              <div className={styles.nameDiv}>
                <b><span className={styles.StudentName}>{(heading === 'Registered Company')? item.data.orgName: item.data.name}</span></b><br />
                <span style={{ color: '#777777', fontSize: '13px' }}>{(heading === 'Students')? item.data.department: item.data.email}</span>
              </div>
            </div>
          ))
        }
      </div>}

    </div>
  )
}

export default AdminHome
