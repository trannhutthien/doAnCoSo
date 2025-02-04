import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ApprovedFeedbacks() {
    const [approvedFeedbacks, setApprovedFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchApprovedFeedbacks();
    }, []);

    const fetchApprovedFeedbacks = async () => {
        try {
            const response = await axios.get('http://localhost:3001/feedbacks?status=approved');
            setApprovedFeedbacks(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching approved feedbacks:', error);
            setError('Không thể tải danh sách phản hồi đã duyệt');
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center p-4">Đang tải...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Báo cáo phản hồi đã duyệt</h2>

            {approvedFeedbacks.length === 0 ? (
                <p className="text-gray-500 text-center">Chưa có phản hồi nào được duyệt</p>
            ) : (
                <div className="grid gap-6">
                    {approvedFeedbacks.map((feedback) => (
                        <div 
                            key={feedback.id} 
                            className="bg-white p-6 rounded-lg shadow-md"
                        >
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="font-semibold">Phụ huynh:</p>
                                    <p className="text-gray-600">{feedback.parentName}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Ngày gửi:</p>
                                    <p className="text-gray-600">
                                        {new Date(feedback.createdAt).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold">Ngày thực đơn:</p>
                                    <p className="text-gray-600">{feedback.menuDate}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Trạng thái:</p>
                                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                                        Đã duyệt
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="font-semibold">Nội dung phản hồi:</p>
                                    <p className="text-gray-600">{feedback.content}</p>
                                </div>

                                {feedback.allergies && (
                                    <div>
                                        <p className="font-semibold">Thông tin dị ứng:</p>
                                        <p className="text-gray-600">{feedback.allergies}</p>
                                    </div>
                                )}

                                {feedback.preferences && (
                                    <div>
                                        <p className="font-semibold">Sở thích ăn uống:</p>
                                        <p className="text-gray-600">{feedback.preferences}</p>
                                    </div>
                                )}

                                {feedback.teacherResponse && (
                                    <div>
                                        <p className="font-semibold">Phản hồi của giáo viên:</p>
                                        <p className="text-gray-600">{feedback.teacherResponse}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ApprovedFeedbacks; 