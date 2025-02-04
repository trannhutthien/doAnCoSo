import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FeedbackApproval() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch feedbacks khi component mount
    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const response = await axios.get('http://localhost:3001/feedbacks');
            setFeedbacks(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
            setError('Không thể tải danh sách phản hồi');
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (feedbackId, newStatus, response = '') => {
        try {
            await axios.patch(`http://localhost:3001/feedbacks/${feedbackId}`, {
                status: newStatus,
                teacherResponse: response
            });
            // Refresh danh sách sau khi cập nhật
            fetchFeedbacks();
        } catch (error) {
            console.error('Error updating feedback:', error);
            setError('Không thể cập nhật trạng thái phản hồi');
        }
    };

    if (loading) return <div className="text-center p-4">Đang tải...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Phê duyệt phản hồi từ phụ huynh</h2>

            {feedbacks.length === 0 ? (
                <p className="text-gray-500 text-center">Chưa có phản hồi nào</p>
            ) : (
                <div className="space-y-4">
                    {feedbacks.map((feedback) => (
                        <div 
                            key={feedback.id} 
                            className="bg-white p-6 rounded-lg shadow-md"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold text-lg">
                                        Phụ huynh: {feedback.parentName}
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        Ngày gửi: {new Date(feedback.createdAt).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm ${
                                    feedback.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    feedback.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {feedback.status === 'pending' ? 'Chờ duyệt' :
                                     feedback.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                                </span>
                            </div>

                            <div className="mb-4">
                                <p className="font-medium">Ngày thực đơn:</p>
                                <p className="text-gray-600">{feedback.menuDate}</p>
                            </div>

                            <div className="mb-4">
                                <p className="font-medium">Nội dung phản hồi:</p>
                                <p className="text-gray-600">{feedback.content}</p>
                            </div>

                            {feedback.allergies && (
                                <div className="mb-4">
                                    <p className="font-medium">Thông tin dị ứng:</p>
                                    <p className="text-gray-600">{feedback.allergies}</p>
                                </div>
                            )}

                            {feedback.preferences && (
                                <div className="mb-4">
                                    <p className="font-medium">Sở thích ăn uống:</p>
                                    <p className="text-gray-600">{feedback.preferences}</p>
                                </div>
                            )}

                            {feedback.status === 'pending' && (
                                <div className="flex space-x-4 mt-4">
                                    <button
                                        onClick={() => handleUpdateStatus(feedback.id, 'approved')}
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        Phê duyệt
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(feedback.id, 'rejected')}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Từ chối
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FeedbackApproval; 