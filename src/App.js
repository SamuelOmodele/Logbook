import React, { useState } from 'react';

import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './components/student_page/Home.jsx';
import Logbook from './components/student_page/Logbook.jsx';
import Company from './components/student_page/Company.jsx';
import Sign_in from './components/regiter_login/Login.jsx';
import Admin from './components/admin_/AdminHome.jsx';
import HomeLayout from './components/student_page/HomeLayout.jsx';
import AdminLayout from './components/admin_/AdminLayout.jsx';
import AuthLayout from './components/regiter_login/AuthLayout.jsx';
import E404 from './components/Error404/E404.jsx';
import OrgLayout from './components/organization/OrgLayout.jsx'
import OrgHome from './components/organization/orgHome.jsx'
import SupervisorLayout from './components/Company_Supervisors/SupervisorLayout.jsx';

import SupervisorHome from './components/Company_Supervisors/SupervisorHome.jsx';
import SupervisorStudent from './components/Company_Supervisors/SupervisorStudent.jsx';
import RegisterOrganzation from './components/regiter_login/RegisterOrganzation.jsx';
import OrgStudent from './components/organization/OrgStudent.jsx';
import OrgSupervisor from './components/organization/OrgSupervisor.jsx';
import Department from './components/admin_/Department.jsx';
import ViewDeptSupervisors from './components/admin_/ViewDeptSupervisors.jsx';
import Register from './components/regiter_login/Register.jsx';
import DeptSupHome from './components/Department_Supervisor/DeptSupHome.jsx';
import DeptSupLayout from './components/Department_Supervisor/DeptSupLayout.jsx';
import DeptSupStudent from './components/Department_Supervisor/DeptSupStudent.jsx';
function App() {


  return (
    // <div className={`app ${shouldRenderSidebar ? '' : 'no-sidebar'}`}>
    <div>
      {/* <Sidebar /> */}
      <Routes>
        <Route path='/' element={<HomeLayout />}>
          <Route path='' element={<Home />} />
          <Route path='logbook' element={<Logbook />} />
          <Route path='company' element={<Company />} />
        </Route>

        <Route path='/admin' element={<AdminLayout />}>
          <Route path='' element={<Admin />} />
          <Route path='departments' element={<Department />} />
          <Route path='viewDepartmentSupervisors' element={<ViewDeptSupervisors />} />
        </Route>

        <Route path='/auth' element={<AuthLayout />}>
          <Route path='sign-up' element={<Register />} />
          <Route path='sign-in' element={<Sign_in />} />
          <Route path='sign-up-org' element={<RegisterOrganzation />} />
        </Route>

        <Route path='*' element={<E404 />} />

        <Route path='/org' element={<OrgLayout />}>
          <Route path='' element={<OrgHome />} />
          <Route path='student' element={<OrgStudent />} />
          <Route path='supervisors' element={<OrgSupervisor />}/>
        </Route>

        <Route path='/supervisor' element={<SupervisorLayout/>}>
          <Route path='' element={<SupervisorHome />} />
          <Route path='student' element={<SupervisorStudent />} />
        </Route>

        <Route path='/dept-supervisor' element={<DeptSupLayout />}>
          <Route path='' element={<DeptSupHome />} />
          <Route path='student' element={<DeptSupStudent />} />
        </Route>

      </Routes>

    </div>
  );
}

export default App;
