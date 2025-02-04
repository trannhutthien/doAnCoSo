import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SystemReports() {
    const [approvedFeedbacks, setApprovedFeedbacks] = useState([]);
    const [menuSuggestions, setMenuSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('reports');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [feedbacksResponse, suggestionsResponse] = await Promise.all([
                axios.get('http://localhost:3001/feedbacks?status=approved'),
                axios.get('http://localhost:3001/menu_suggestions')
            ]);

            setApprovedFeedbacks(feedbacksResponse.data);
            setMenuSuggestions(suggestionsResponse.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Không thể tải dữ liệu');
            setLoading(false);
        }
    };

    // Thêm hàm xử lý phê duyệt/từ chối
    const handleSuggestionStatus = async (suggestionId, newStatus) => {
        try {
            await axios.patch(`http://localhost:3001/menu_suggestions/${suggestionId}`, {
                status: newStatus,
                updatedAt: new Date().toISOString()
            });
            // Refresh data sau khi cập nhật
            fetchData();
        } catch (error) {
            console.error('Error updating suggestion:', error);
            setError('Không thể cập nhật trạng thái đề xuất');
        }
    };

    if (loading) return <div className="text-center p-4">Đang tải...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Báo cáo hệ thống</h2>

            {/* Tab Navigation */}
            <div className="flex space-x-4 mb-6">
                <button
                    className={`px-4 py-2 rounded-lg ${
                        activeTab === 'reports' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => setActiveTab('reports')}
                >
                    Báo cáo chung
                </button>
                <button
                    className={`px-4 py-2 rounded-lg ${
                        activeTab === 'feedbacks' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => setActiveTab('feedbacks')}
                >
                    Phản hồi đã duyệt
                </button>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'reports' ? (
                <div className="space-y-8">
                    {/* Phần thống kê tổng quan */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-100 p-4 rounded-lg">
                            <h3 className="font-semibold text-blue-800">Tổng số phản hồi đã duyệt</h3>
                            <p className="text-2xl font-bold text-blue-600">{approvedFeedbacks.length}</p>
                        </div>
                        <div className="bg-green-100 p-4 rounded-lg">
                            <h3 className="font-semibold text-green-800">Tổng số đề xuất thực đơn</h3>
                            <p className="text-2xl font-bold text-green-600">{menuSuggestions.length}</p>
                        </div>
                        <div className="bg-purple-100 p-4 rounded-lg">
                            <h3 className="font-semibold text-purple-800">Đề xuất đang chờ duyệt</h3>
                            <p className="text-2xl font-bold text-purple-600">
                                {menuSuggestions.filter(s => s.status === 'pending').length}
                            </p>
                        </div>
                    </div>

                    {/* Phần đề xuất thực đơn mới nhất */}
                    <div className="mt-8">
                        <h3 className="text-xl font-bold mb-4">Đề xuất thực đơn mới nhất</h3>
                        <div className="grid gap-6">
                            {menuSuggestions
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                .slice(0, 3)
                                .map((suggestion) => (
                                <div key={suggestion.id} className="bg-white p-6 rounded-lg shadow-md">
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="font-semibold">Giáo viên đề xuất:</p>
                                            <p className="text-gray-600">{suggestion.teacherName}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Ngày áp dụng:</p>
                                            <p className="text-gray-600">{suggestion.date}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="font-semibold">Món chính:</p>
                                            <p className="text-gray-600">{suggestion.mainDish.name}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Lý do đề xuất:</p>
                                            <p className="text-gray-600">{suggestion.reason}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold">Trạng thái:</p>
                                                <span className={`px-3 py-1 rounded-full text-sm ${
                                                    suggestion.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    suggestion.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {suggestion.status === 'pending' ? 'Chờ duyệt' :
                                                     suggestion.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                                                </span>
                                            </div>
                                            
                                            {suggestion.status === 'pending' && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleSuggestionStatus(suggestion.id, 'approved')}
                                                        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                                                        title="Phê duyệt"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleSuggestionStatus(suggestion.id, 'rejected')}
                                                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                        title="Từ chối"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Phần phản hồi gần đây */}
                    <div className="mt-8">
                        <h3 className="text-xl font-bold mb-4">Phản hồi gần đây</h3>
                        <div className="grid gap-6">
                            {approvedFeedbacks
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                .slice(0, 3)
                                .map((feedback) => (
                                <div key={feedback.id} className="bg-white p-6 rounded-lg shadow-md">
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
                                    </div>
                                    <div>
                                        <p className="font-semibold">Nội dung phản hồi:</p>
                                        <p className="text-gray-600">{feedback.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6">
                    {approvedFeedbacks.length === 0 ? (
                        <p className="text-gray-500 text-center">Chưa có phản hồi nào được duyệt</p>
                    ) : (
                        approvedFeedbacks.map((feedback) => (
                            <div key={feedback.id} className="bg-white p-6 rounded-lg shadow-md">
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
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default SystemReports; 