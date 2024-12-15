import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function AdminDashboard() {
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-purple-600 text-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <span className="font-bold text-xl">Trang Quản Trị</span>
                        </div>
                        <div className="flex space-x-4">
                            <Link to="/admin/users" className="hover:bg-purple-700 px-3 py-2 rounded">
                                Quản lý tài khoản
                            </Link>
                            <Link to="/admin/menus" className="hover:bg-purple-700 px-3 py-2 rounded">
                                Quản lý thực đơn
                            </Link>
                            <Link to="/admin/roles" className="hover:bg-purple-700 px-3 py-2 rounded">
                                Phân quyền
                            </Link>
                            <Link to="/admin/reports" className="hover:bg-purple-700 px-3 py-2 rounded">
                                Báo cáo
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

export default AdminDashboard; 