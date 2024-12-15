import React, { useState, useEffect } from 'react';

function RoleManagement() {
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [permissions, setPermissions] = useState({
        manage_users: false,
        manage_menus: false,
        manage_roles: false,
        view_reports: false,
        evaluate_menus: false,
        manage_students: false,
        send_feedback: false
    });

    useEffect(() => {
        fetchRoles();
        fetchUsers();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await fetch('http://localhost:3001/roles');
            const data = await response.json();
            setRoles(data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3001/users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleUserSelect = async (userId) => {
        try {
            const user = users.find(u => u.id === userId);
            setSelectedUser(user);

            // Tìm role tương ứng
            const roleResponse = await fetch(`http://localhost:3001/roles?name=${user.role}`);
            const roleData = await roleResponse.json();
            if (roleData.length > 0) {
                const rolePermissions = roleData[0].permissions.reduce((acc, perm) => ({
                    ...acc,
                    [perm]: true
                }), {});
                setPermissions(rolePermissions);
            }
        } catch (error) {
            console.error('Error fetching user role:', error);
        }
    };

    const handlePermissionChange = async (permission) => {
        try {
            const newPermissions = {
                ...permissions,
                [permission]: !permissions[permission]
            };
            setPermissions(newPermissions);

            // Cập nhật permissions cho role
            if (selectedUser) {
                const roleResponse = await fetch(`http://localhost:3001/roles?name=${selectedUser.role}`);
                const roleData = await roleResponse.json();
                if (roleData.length > 0) {
                    const role = roleData[0];
                    await fetch(`http://localhost:3001/roles/${role.id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            permissions: Object.entries(newPermissions)
                                .filter(([_, value]) => value)
                                .map(([key]) => key)
                        }),
                    });
                }
            }
        } catch (error) {
            console.error('Error updating permissions:', error);
        }
    };

    const handleRoleChange = async (e) => {
        try {
            const newRole = e.target.value;
            await fetch(`http://localhost:3001/users/${selectedUser.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    role: newRole
                }),
            });

            // Cập nhật danh sách users
            fetchUsers();

            // Cập nhật selectedUser
            setSelectedUser({ ...selectedUser, role: newRole });

            // Lấy permissions mới từ role
            const roleResponse = await fetch(`http://localhost:3001/roles?name=${newRole}`);
            const roleData = await roleResponse.json();
            if (roleData.length > 0) {
                const rolePermissions = roleData[0].permissions.reduce((acc, perm) => ({
                    ...acc,
                    [perm]: true
                }), {});
                setPermissions(rolePermissions);
            }
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Phân quyền người dùng</h2>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold mb-4">Danh sách người dùng</h3>
                    <div className="space-y-4">
                        {users.map(user => (
                            <div
                                key={user.id}
                                className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${selectedUser?.id === user.id ? 'bg-purple-50 border-purple-300' : ''
                                    }`}
                                onClick={() => handleUserSelect(user.id)}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{user.name}</p>
                                        <p className="text-sm text-gray-600">{user.email}</p>
                                    </div>
                                    <span className="px-2 py-1 bg-gray-100 rounded text-sm capitalize">
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {selectedUser && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-xl font-semibold mb-4">Cấu hình quyền</h3>

                        <div className="mb-6">
                            <label className="block mb-2">Vai trò</label>
                            <select
                                value={selectedUser.role}
                                onChange={handleRoleChange}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="admin">Admin</option>
                                <option value="giaovien">Giáo viên</option>
                                <option value="phuhuynh">Phụ huynh</option>
                            </select>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-medium">Quyền hạn:</h4>

                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={permissions.manage_users}
                                        onChange={() => handlePermissionChange('manage_users')}
                                        className="mr-2"
                                    />
                                    Quản lý người dùng
                                </label>

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={permissions.manage_menus}
                                        onChange={() => handlePermissionChange('manage_menus')}
                                        className="mr-2"
                                    />
                                    Quản lý thực đơn
                                </label>

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={permissions.manage_roles}
                                        onChange={() => handlePermissionChange('manage_roles')}
                                        className="mr-2"
                                    />
                                    Quản lý phân quyền
                                </label>

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={permissions.view_reports}
                                        onChange={() => handlePermissionChange('view_reports')}
                                        className="mr-2"
                                    />
                                    Xem báo cáo
                                </label>

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={permissions.evaluate_menus}
                                        onChange={() => handlePermissionChange('evaluate_menus')}
                                        className="mr-2"
                                    />
                                    Đánh giá thực đơn
                                </label>

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={permissions.manage_students}
                                        onChange={() => handlePermissionChange('manage_students')}
                                        className="mr-2"
                                    />
                                    Quản lý học sinh
                                </label>

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={permissions.send_feedback}
                                        onChange={() => handlePermissionChange('send_feedback')}
                                        className="mr-2"
                                    />
                                    Gửi phản hồi
                                </label>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RoleManagement; 