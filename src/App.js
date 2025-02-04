import React from 'react';
import Register from './components/Register';
import Login from './components/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ParentDashboard from './components/parent/ParentDashboard';
import Menu from './components/parent/Menu';
import Feedback from './components/parent/Feedback';
import NutritionReport from './components/parent/NutritionReport';
import Schedule from './components/parent/Schedule';
import Grades from './components/parent/Grades';
import AbsenceRequest from './components/parent/AbsenceRequest';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import TeacherMenu from './components/teacher/TeacherMenu';
import MenuApproval from './components/teacher/MenuApproval';
import MenuSuggestion from './components/teacher/MenuSuggestion';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import MenuManagement from './components/admin/MenuManagement';
import SystemReports from './components/admin/SystemReports';
import RoleManagement from './components/admin/RoleManagement';
import ChefDashboard from './components/chef/ChefDashboard';
import MenuBuilder from './components/chef/MenuBuilder';
import SuggestionViewer from './components/chef/SuggestionViewer';
import MenuReport from './components/chef/MenuReport';
import NavBar from './components/NavBar';
import FeedbackApproval from './components/teacher/FeedbackApproval';
import ApprovedFeedbacks from './components/admin/ApprovedFeedbacks';

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <NavBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="users" element={<UserManagement />} />
          <Route path="menus" element={<MenuManagement />} />
          <Route path="reports" element={<SystemReports />} />
          <Route path="roles" element={<RoleManagement />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/phuhuynh" element={<ParentDashboard />}>
          <Route path="thucdon" element={<Menu />} />
          <Route path="phanhoi" element={<Feedback />} />
          <Route path="dinhduong" element={<NutritionReport />} />
          <Route path="thoikhoabieu" element={<Schedule />} />
          <Route path="diem" element={<Grades />} />
          <Route path="xin-nghi" element={<AbsenceRequest />} />
        </Route>
        <Route path="/giaovien" element={<TeacherDashboard />}>
          <Route path="thucdon" element={<TeacherMenu />} />
          <Route path="pheduyet" element={<MenuApproval />} />
          <Route path="dexuat" element={<MenuSuggestion />} />
          <Route path="phe-duyet-phan-hoi" element={<FeedbackApproval />} />
        </Route>
        <Route path="/daubep" element={<ChefDashboard />}>
          <Route path="thucdon" element={<MenuManagement />} />
          <Route path="dexuat" element={<SuggestionViewer />} />
          <Route path="baocao" element={<MenuReport />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
