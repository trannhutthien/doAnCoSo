import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function ChefDashboard() {
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-orange-600 text-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <span className="font-bold text-xl">Trang Đầu Bếp</span>
                        </div>
                        <div className="flex space-x-4">
                            <Link to="/daubep/thucdon" className="hover:bg-orange-700 px-3 py-2 rounded">
                                Quản lý thực đơn
                            </Link>
                            <Link to="/daubep/dexuat" className="hover:bg-orange-700 px-3 py-2 rounded">
                                Đề xuất
                            </Link>
                            <Link to="/daubep/baocao" className="hover:bg-orange-700 px-3 py-2 rounded">
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

export default ChefDashboard; 