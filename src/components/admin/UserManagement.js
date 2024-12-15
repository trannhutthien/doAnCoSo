import React, { useState, useEffect } from 'react';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        email: '',
        phone: '',
        role: 'phuhuynh'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3001/users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = selectedUser ? 'PUT' : 'POST';
            const url = selectedUser
                ? `http://localhost:3001/users/${selectedUser.id}`
                : 'http://localhost:3001/users';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                fetchUsers();
                resetForm();
            }
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
            try {
                await fetch(`http://localhost:3001/users/${userId}`, {
                    method: 'DELETE',
                });
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const handleResetPassword = async (userId) => {
        try {
            await fetch(`http://localhost:3001/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: '123456' // Mật khẩu mặc định
                }),
            });
            alert('Đã reset mật khẩu thành công!');
        } catch (error) {
            console.error('Error resetting password:', error);
        }
    };

    const resetForm = () => {
        setSelectedUser(null);
        setFormData({
            name: '',
            code: '',
            email: '',
            phone: '',
            role: 'phuhuynh'
        });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Quản lý tài khoản</h2>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-2">Họ tên</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Mã số</label>
                        <input
                            type="text"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Số điện thoại</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Vai trò</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full border rounded px-3 py-2"
                            required
                        >
                            <option value="phuhuynh">Phụ huynh</option>
                            <option value="giaovien">Giáo viên</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                        {selectedUser ? 'Cập nhật' : 'Thêm mới'}
                    </button>
                </div>
            </form>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mã số
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Họ tên
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Vai trò
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{user.code}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap capitalize">{user.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setSelectedUser(user)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Xóa
                                        </button>
                                        <button
                                            onClick={() => handleResetPassword(user.id)}
                                            className="text-green-600 hover:text-green-900"
                                        >
                                            Reset MK
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserManagement; 