import React from 'react'
import './Logbook.css' /*inherit style from Logbook.css */


const Submit_report = () => {
    return (
        <div className='submit_'>
            <div className="submit-info">
                <span>Attach Relevant Diagram</span>
                <div className="upload">

                    <input className='fileInput' type="file" name="" id="" />
                </div>
            </div>
            <button className="btn">Save</button>
        </div>
    )
}

export default Submit_report
