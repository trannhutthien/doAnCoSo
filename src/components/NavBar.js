import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function NavBar() {
    const location = useLocation();
    const path = location.pathname;

    return (
        <header className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold hover:text-blue-200">
                    Quản Lý Thức Ăn Mầm Non
                </Link>
                <nav className="space-x-4">
                    {path === '/' ? (
                        <>
                            <Link to="/login" className="hover:text-blue-200">Đăng nhập</Link>
                            <Link to="/register" className="hover:text-blue-200">Đăng ký</Link>
                        </>
                    ) : (
                        <Link to="/" className="hover:text-blue-200">Trang chủ</Link>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default NavBar; 