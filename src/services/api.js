import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const loginUser = async (code, password) => {
    try {
        const response = await fetch(`${API_URL}/users?code=${code}`);
        const users = await response.json();

        if (users.length === 0) {
            throw new Error('Mã số không tồn tại');
        }

        const user = users[0];
        if (user.password !== password) {
            throw new Error('Mật khẩu không chính xác');
        }

        // Xóa password trước khi trả về
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    } catch (error) {
        throw error;
    }
};

export const registerUser = async (userData) => {
    try {
        // Kiểm tra mã số đã tồn tại
        const checkExisting = await fetch(`${API_URL}/users?code=${userData.code}`);
        const existingUsers = await checkExisting.json();

        if (existingUsers.length > 0) {
            throw new Error('Mã số đã tồn tại');
        }

        // Kiểm tra email đã tồn tại
        const checkEmail = await fetch(`${API_URL}/users?email=${userData.email}`);
        const existingEmails = await checkEmail.json();

        if (existingEmails.length > 0) {
            throw new Error('Email đã được sử dụng');
        }

        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...userData,
                id: Date.now(), // Tạo ID tự động
            }),
        });

        if (!response.ok) {
            throw new Error('Đăng ký thất bại');
        }

        const newUser = await response.json();
        const { password: _, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    } catch (error) {
        throw error;
    }
};

export const saveFeedback = async (feedbackData) => {
    try {
        console.log('Sending feedback data:', feedbackData);
        const response = await axios.post(`${API_URL}/feedbacks`, feedbackData);
        console.log('Server response:', response.data);
        return response.data;
    } catch (error) {
        throw new Error('Không thể gửi phản hồi: ' + error.message);
    }
}; 