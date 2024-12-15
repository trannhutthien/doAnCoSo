import React, { useState, useEffect } from 'react';

function MenuReport() {
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            const response = await fetch('http://localhost:3001/dish_statistics');
            const data = await response.json();
            setStatistics(data);
        } catch (error) {
            console.error('Error fetching statistics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Đang tải...</div>;
    if (!statistics) return <div>Không có dữ liệu thống kê</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Báo cáo thực đơn</h2>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold mb-4">Món ăn phổ biến nhất</h3>
                    <div className="space-y-4">
                        {statistics.most_popular.map(dish => (
                            <div key={dish.dishId} className="border-b pb-4 last:border-b-0">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-medium">{dish.name}</h4>
                                    <span className="text-sm text-gray-600">
                                        {dish.usageCount} lần sử dụng
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <div className="flex-1 h-2 bg-gray-200 rounded">
                                        <div
                                            className="h-full bg-orange-600 rounded"
                                            style={{ width: `${(dish.averageRating / 5) * 100}%` }}
                                        />
                                    </div>
                                    <span className="ml-2 text-sm">
                                        {dish.averageRating.toFixed(1)}/5
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold mb-4">Xu hướng theo tháng</h3>
                    <div className="space-y-4">
                        {Object.entries(statistics.monthly_trends).map(([month, data]) => (
                            <div key={month} className="border-b pb-4 last:border-b-0">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-medium">Tháng {month}</h4>
                                    <span className="text-sm text-gray-600">
                                        {data.total_dishes} món
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <div className="flex-1 h-2 bg-gray-200 rounded">
                                        <div
                                            className="h-full bg-orange-600 rounded"
                                            style={{ width: `${(data.average_rating / 5) * 100}%` }}
                                        />
                                    </div>
                                    <span className="ml-2 text-sm">
                                        {data.average_rating.toFixed(1)}/5
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MenuReport; 