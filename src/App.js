import React from 'react';
import Register from './components/Register';
import Login from './components/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-gray-100">
            <main className="container mx-auto py-8 px-4">
              <section className="mb-12 text-center">
                <h2 className="text-3xl font-bold mb-4">Chào mừng đến với hệ thống quản lý thức ăn</h2>
                <p className="text-gray-600 mb-8">Theo dõi và quản lý dinh dưỡng cho trẻ mầm non</p>

                <div className="max-w-3xl mx-auto text-left bg-white p-6 rounded-lg shadow-md mb-8">
                  <h3 className="text-2xl font-semibold mb-4">Giới thiệu về hệ thống</h3>
                  <p className="mb-4">Hệ thống quản lý thức ăn mầm non là giải pháp toàn diện giúp theo dõi và đảm bảo dinh dưỡng cho trẻ. Chúng tôi cung cấp các tính năng:</p>
                  <ul className="list-disc list-inside mb-4 space-y-2">
                    <li>Theo dõi thực đơn hàng ngày</li>
                    <li>Đánh giá dinh dưỡng cho từng bữa ăn</li>
                    <li>Tương tác giữa phụ huynh và nhà trường</li>
                    <li>Quản lý thông tin dinh dưỡng chuyên nghiệp</li>
                  </ul>
                </div>

                <div className="max-w-3xl mx-auto text-left bg-white p-6 rounded-lg shadow-md mb-8">
                  <h3 className="text-2xl font-semibold mb-4">Chính sách bảo mật</h3>
                  <p className="mb-4">Chúng tôi cam kết bảo vệ thông tin của người dùng:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Mã hóa thông tin cá nhân</li>
                    <li>Không chia sẻ dữ liệu với bên thứ ba</li>
                    <li>Tuân thủ quy định bảo vệ dữ liệu</li>
                    <li>Định kỳ cập nhật các biện pháp bảo mật</li>
                  </ul>
                </div>

                <div className="max-w-3xl mx-auto text-left bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-2xl font-semibold mb-4">Thông tin liên hệ</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Địa chỉ văn phòng:</h4>
                      <p className="mb-4">123 Đường ABC, Quận XYZ, TP.HCM</p>

                      <h4 className="font-semibold mb-2">Điện thoại hỗ trợ:</h4>
                      <p className="mb-4">Hotline: 1900 xxxx</p>
                      <p>Kỹ thuật: 0123.456.789</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Giờ làm việc:</h4>
                      <p className="mb-4">Thứ 2 - Thứ 6: 8:00 - 17:00</p>

                      <h4 className="font-semibold mb-2">Kết nối với chúng tôi:</h4>
                      <div className="flex space-x-4">
                        <a href="#" className="text-blue-600 hover:text-blue-800">Facebook</a>
                        <a href="#" className="text-blue-600 hover:text-blue-800">Zalo</a>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </main>

            <footer className="bg-gray-800 text-white py-6">
              <div className="container mx-auto px-4 text-center">
                <div className="mb-4">
                  <h4 className="font-semibold">Liên Hệ</h4>
                  <p>Điện thoại: 0123456789</p>
                  <p>Email: contact@mamnon.edu.vn</p>
                </div>
                <div className="flex justify-center space-x-4">
                  <a href="#" className="hover:text-blue-400">Facebook</a>
                  <a href="#" className="hover:text-blue-400">Zalo</a>
                </div>
              </div>
            </footer>
          </div>
        } />
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
        </Route>
        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="users" element={<UserManagement />} />
          <Route path="menus" element={<MenuManagement />} />
          <Route path="reports" element={<SystemReports />} />
          <Route path="roles" element={<RoleManagement />} />
        </Route>
        <Route path="/daubep" element={<ChefDashboard />}>
          <Route path="thucdon" element={<MenuBuilder />} />
          <Route path="dexuat" element={<SuggestionViewer />} />
          <Route path="baocao" element={<MenuReport />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
