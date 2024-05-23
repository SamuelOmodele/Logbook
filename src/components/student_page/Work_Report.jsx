import React, {useEffect, useState} from 'react'
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const Work_Report = ({week, id, entity, dept_sup}) => {

    const [user, setUser] = useState(null);

    useEffect(() => {
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

        fetchDocument(id);
        
    }, [])

    useEffect(() => {
        if (user){
            if (user[`${week}-mon`]){
                setMon(user[`${week}-mon`]);
            }
            if (user[`${week}-tue`]){
                setTue(user[`${week}-tue`]);
            }
            if (user[`${week}-wed`]){
                setWed(user[`${week}-wed`]);
            }
            if (user[`${week}-thur`]){
                setThur(user[`${week}-thur`]);
            }
            if (user[`${week}-fri`]){
                setFri(user[`${week}-fri`]);
            }
            if (user[`${week}-org-sup-comment`]){
                setOrgSupComment(user[`${week}-org-sup-comment`]);
            }
        }
        
    }, [user])

    

    const [mon, setMon] = useState('');
    const [tue, setTue] = useState('');
    const [wed, setWed] = useState('');
    const [thur, setThur] = useState('');
    const [fri, setFri] = useState('');
    const [orgSupComment, setOrgSupComment] = useState('');

    const saveLogbook = async(e) => {

        e.preventDefault();

        if (mon === '' || tue === '' || wed === '' || thur === '' || fri === ''){
            alert(`Please fill all days for week ${week.slice(-1)}`)
        } else {
            const newData = {
                [`${week}-mon`] : mon,    
                [`${week}-tue`] : tue,    
                [`${week}-wed`] : wed,    
                [`${week}-thur`] : thur,    
                [`${week}-fri`] : fri,    
            };

            try{
                const docRef = doc(db, 'StudentRecord', id);
                await updateDoc(docRef, newData);
                console.log('updated successful');
                alert('updated successful');
            }catch(err) {
                console.error(err);
            }
        }

        
    }
    const saveOrgSupComment = async(e) => {

        e.preventDefault();

        if (orgSupComment === ''){
            alert(`Please write a comment for week ${week.slice(-1)}`)
        } else {
            const newData = {
                [`${week}-org-sup-comment`] : orgSupComment,  
            };

            try{
                const docRef = doc(db, 'StudentRecord', id);
                await updateDoc(docRef, newData);
                console.log('updated successful');
                alert('updated successful');
            }catch(err) {
                console.error(err);
            }
            console.log('hi')
        }

        
    }

    return (
        <div className='Work_report'>
            {user && <div className="week-1">
                        <div className="report">
                            <div className="row-1">
                                <span className='day'>Monday</span>
                                <span className='date'>2/2/2024</span>
                            </div>
                            <div className="row-2">
                                {(entity === 'org-sup') && <textarea placeholder='Enter Logbook Entries' name="" id="" cols="30" rows="10" defaultValue={user[`${week}-mon`]} onChange={(e) => setMon(e.target.value)} disabled></textarea>}
                                {(entity !== 'org-sup') && <textarea placeholder='Enter Logbook Entries' name="" id="" cols="30" rows="10" defaultValue={user[`${week}-mon`]} onChange={(e) => setMon(e.target.value)} required></textarea>}
                                
                            </div>
                        </div>
                        <div className="report">
                            <div className="row-1">
                                <span className='day'>Tuesday</span>
                                <span className='date'>3/2/2024</span>
                            </div>
                            <div className="row-2">
                                {(entity === 'org-sup') && <textarea placeholder='Enter Logbook Entries' name="" id="" cols="30" rows="10" defaultValue={user[`${week}-tue`]} onChange={(e) => setTue(e.target.value)} disabled></textarea>}
                                {(entity !== 'org-sup') && <textarea placeholder='Enter Logbook Entries' name="" id="" cols="30" rows="10" defaultValue={user[`${week}-tue`]} onChange={(e) => setTue(e.target.value)} required></textarea>}
                            </div>
                        </div>
                        <div className="report">
                            <div className="row-1">
                                <span className='day'>Wednesday</span>
                                <span className='date'>4/2/2024</span>
                            </div>
                            <div className="row-2">
                                {(entity === 'org-sup') && <textarea placeholder='Enter Logbook Entries' name="" id="" cols="30" rows="10" defaultValue={user[`${week}-wed`]} onChange={(e) => setWed(e.target.value)} disabled></textarea>}
                                {(entity !== 'org-sup') && <textarea placeholder='Enter Logbook Entries' name="" id="" cols="30" rows="10" defaultValue={user[`${week}-wed`]} onChange={(e) => setWed(e.target.value)} required></textarea>}
                            </div>
                        </div>
                        <div className="report">
                            <div className="row-1">
                                <span className='day'>Thursday</span>
                                <span className='date'>5/2/2024</span>
                            </div>
                            <div className="row-2">
                                {(entity === 'org-sup') && <textarea placeholder='Enter Logbook Entries' name="" id="" cols="30" rows="10" defaultValue={user[`${week}-thur`]} onChange={(e) => setThur(e.target.value)} disabled></textarea>}
                                {(entity !== 'org-sup') && <textarea placeholder='Enter Logbook Entries' name="" id="" cols="30" rows="10" defaultValue={user[`${week}-thur`]} onChange={(e) => setThur(e.target.value)} required></textarea>}
                                
                            </div>
                        </div>
                        <div className="report">
                            <div className="row-1">
                                <span className='day'>Friday</span>
                                <span className='date'>6/2/2024</span>
                            </div>
                            <div className="row-2">
                                {(entity === 'org-sup') && <textarea placeholder='Enter Logbook Entries' name="" id="" cols="30" rows="10" defaultValue={user[`${week}-fri`]} onChange={(e) => setFri(e.target.value)} disabled></textarea>}
                                {(entity !== 'org-sup') && <textarea placeholder='Enter Logbook Entries' name="" id="" cols="30" rows="10" defaultValue={user[`${week}-fri`]} onChange={(e) => setFri(e.target.value)} required></textarea>}
                            </div>
                        </div>
                {(entity === 'org-sup' && !dept_sup) && <textarea className='Sup_comm' name="" id="" cols="30" rows="5" defaultValue={orgSupComment} onChange={(e) => setOrgSupComment(e.target.value)} placeholder='Industry Based Supervisor Comment ...' ></textarea>}
                {(entity === 'org-sup' && dept_sup) && <textarea className='Sup_comm' name="" id="" cols="30" rows="5" defaultValue={orgSupComment}  placeholder='Industry Based Supervisor Comment ...' disabled></textarea>}
                {(entity !== 'org-sup' && !dept_sup) && <textarea className='Sup_comm' name="" id="" cols="30" rows="5" defaultValue={user[`${week}-org-sup-comment`]} placeholder='Industry Based Supervisor Comment ...' disabled></textarea>}
            
                <div className="submit-report">
                    <div className='submit_'>
                        <button type='submit' className="btn" onClick={(entity === 'org-sup') ? saveOrgSupComment: saveLogbook}>Save</button>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default Work_Report
