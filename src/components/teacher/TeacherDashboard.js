import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function TeacherDashboard() {
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-green-600 text-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <span className="font-bold text-xl">Trang Giáo Viên</span>
                        </div>
                        <div className="flex space-x-4">
                            <Link to="/giaovien/thucdon" className="hover:bg-green-700 px-3 py-2 rounded">
                                Thực đơn
                            </Link>
                            <Link to="/giaovien/pheduyet" className="hover:bg-green-700 px-3 py-2 rounded">
                                Phê duyệt yêu cầu
                            </Link>
                            <Link to="/giaovien/dexuat" className="hover:bg-green-700 px-3 py-2 rounded">
                                Đề xuất thực đơn
                            </Link>
                            <Link to="/giaovien/phe-duyet-phan-hoi" className="hover:bg-blue-700 px-3 py-2 rounded">
                                Phê duyệt phản hồi
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
}

export default TeacherDashboard; 