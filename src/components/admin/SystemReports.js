import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SystemReports() {
    const [approvedFeedbacks, setApprovedFeedbacks] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('feedbacks'); // Mặc định hiển thị tab phản hồi

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch phản hồi đã duyệt
            const feedbacksResponse = await axios.get('http://localhost:3001/feedbacks?status=approved');
            setApprovedFeedbacks(feedbacksResponse.data);

            // Fetch reports (nếu có)
            try {
                const reportsResponse = await axios.get('http://localhost:3001/reports');
                setReports(reportsResponse.data);
            } catch (error) {
                console.log('Không có dữ liệu báo cáo');
                setReports([]);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Không thể tải dữ liệu');
            setLoading(false);
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
                        activeTab === 'feedbacks' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => setActiveTab('feedbacks')}
                >
                    Phản hồi đã duyệt
                </button>
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
            </div>

            {/* Content based on active tab */}
            {activeTab === 'reports' ? (
                <div className="grid gap-6">
                    {reports.length === 0 ? (
                        <p className="text-gray-500 text-center">Chưa có báo cáo nào</p>
                    ) : (
                        reports.map((report) => (
                            <div key={report.id} className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold mb-4">{report.title}</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="font-medium">Thời gian:</p>
                                        <p className="text-gray-600">
                                            {new Date(report.date).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-medium">Loại báo cáo:</p>
                                        <p className="text-gray-600">{report.type}</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="font-medium">Nội dung:</p>
                                    <p className="text-gray-600">{report.content}</p>
                                </div>
                            </div>
                        ))
                    )}
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
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default SystemReports; 