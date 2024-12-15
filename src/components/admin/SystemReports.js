import React, { useState, useEffect } from 'react';

function SystemReports() {
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await fetch('http://localhost:3001/system_reports');
            const data = await response.json();
            setReports(data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Đang tải...</div>;
    if (!reports) return <div>Không có dữ liệu báo cáo</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Báo cáo hệ thống</h2>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold mb-4">Thống kê người dùng</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span>Tổng số người dùng:</span>
                            <span className="font-medium">{reports.user_stats.total_users}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Người dùng đang hoạt động:</span>
                            <span className="font-medium">{reports.user_stats.active_users}</span>
                        </div>
                        <div className="border-t pt-4">
                            <h4 className="font-medium mb-2">Phân bố theo vai trò:</h4>
                            {Object.entries(reports.user_stats.by_role).map(([role, count]) => (
                                <div key={role} className="flex justify-between items-center">
                                    <span className="capitalize">{role}:</span>
                                    <span>{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold mb-4">Thống kê thực đơn</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span>Tổng số thực đơn:</span>
                            <span className="font-medium">{reports.menu_stats.total_menus}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Đánh giá trung bình:</span>
                            <span className="font-medium">{reports.menu_stats.average_rating}/5</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Số lượng phản hồi:</span>
                            <span className="font-medium">{reports.menu_stats.feedback_count}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SystemReports; 