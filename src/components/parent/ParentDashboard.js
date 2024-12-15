import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function ParentDashboard() {
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-blue-600 text-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <span className="font-bold text-xl">Trang Phụ Huynh</span>
                        </div>
                        <div className="flex space-x-4">
                            <Link to="/phuhuynh/thucdon" className="hover:bg-blue-700 px-3 py-2 rounded">
                                Thực đơn
                            </Link>
                            <Link to="/phuhuynh/phanhoi" className="hover:bg-blue-700 px-3 py-2 rounded">
                                Phản hồi
                            </Link>
                            <Link to="/phuhuynh/dinhduong" className="hover:bg-blue-700 px-3 py-2 rounded">
                                Báo cáo dinh dưỡng
                            </Link>
                            <Link to="/phuhuynh/thoikhoabieu" className="hover:bg-blue-700 px-3 py-2 rounded">
                                Thời khóa biểu
                            </Link>
                            <Link to="/phuhuynh/diem" className="hover:bg-blue-700 px-3 py-2 rounded">
                                Xem điểm
                            </Link>
                            <Link to="/phuhuynh/xin-nghi" className="hover:bg-blue-700 px-3 py-2 rounded">
                                Xin nghỉ
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

export default ParentDashboard; 