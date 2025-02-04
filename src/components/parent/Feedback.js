import React, { useState } from 'react';
import { saveFeedback } from '../../services/api';

function Feedback() {
    const [feedback, setFeedback] = useState({
        menuDate: '',
        content: '',
        allergies: '',
        preferences: ''
    });
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Lấy thông tin user từ localStorage
            const user = JSON.parse(localStorage.getItem('user'));
            
            const feedbackData = {
                userId: user.id,
                parentName: user.name,
                menuDate: feedback.menuDate,
                content: feedback.content,
                allergies: feedback.allergies,
                preferences: feedback.preferences,
                createdAt: new Date().toISOString(),
                status: 'pending'
            };

            console.log('Sending feedback:', feedbackData);
            
            await saveFeedback(feedbackData);
            setMessage('Gửi phản hồi thành công!');
            // Reset form
            setFeedback({
                menuDate: '',
                content: '',
                allergies: '',
                preferences: ''
            });
            
        } catch (error) {
            console.error('Submit error:', error);
            setMessage('Lỗi: ' + error.message);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Gửi phản hồi</h2>

            {message && (
                <div className={`p-4 mb-4 rounded ${message.includes('Lỗi') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block mb-2">Ngày thực đơn</label>
                    <input
                        type="date"
                        value={feedback.menuDate}
                        onChange={(e) => setFeedback({ ...feedback, menuDate: e.target.value })}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-2">Nội dung phản hồi</label>
                    <textarea
                        value={feedback.content}
                        onChange={(e) => setFeedback({ ...feedback, content: e.target.value })}
                        className="w-full border rounded px-3 py-2 h-32"
                        placeholder="Nhập phản hồi của bạn về thực đơn..."
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2">Thông tin dị ứng (nếu có)</label>
                    <textarea
                        value={feedback.allergies}
                        onChange={(e) => setFeedback({ ...feedback, allergies: e.target.value })}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Nhập thông tin về dị ứng thực phẩm..."
                    />
                </div>

                <div>
                    <label className="block mb-2">Sở thích ăn uống</label>
                    <textarea
                        value={feedback.preferences}
                        onChange={(e) => setFeedback({ ...feedback, preferences: e.target.value })}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Nhập sở thích ăn uống của con..."
                    />
                </div>

                <button 
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                >
                    Gửi phản hồi
                </button>
            </form>
        </div>
    );
}

export default Feedback; 