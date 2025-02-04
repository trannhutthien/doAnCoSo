import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ChefSuggestion() {
    const [approvedSuggestions, setApprovedSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchApprovedSuggestions();
    }, []);

    const fetchApprovedSuggestions = async () => {
        try {
            const response = await axios.get('http://localhost:3001/menu_suggestions?status=approved');
            setApprovedSuggestions(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching approved suggestions:', error);
            setError('Không thể tải danh sách đề xuất đã duyệt');
            setLoading(false);
        }
    };

    // Thêm hàm format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Thêm object để map loại bữa ăn
    const mealTypeMap = {
        breakfast: 'Bữa sáng',
        lunch: 'Bữa trưa',
        snack: 'Bữa phụ'
    };

    if (loading) return <div className="text-center p-4">Đang tải...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Đề xuất thực đơn đã duyệt</h2>

            {approvedSuggestions.length === 0 ? (
                <p className="text-gray-500 text-center">Chưa có đề xuất thực đơn nào được duyệt</p>
            ) : (
                <div className="grid gap-6">
                    {approvedSuggestions
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((suggestion) => (
                            <div key={suggestion.id} className="bg-white p-6 rounded-lg shadow-md">
                                {/* Header với trạng thái */}
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold">
                                        Thực đơn {mealTypeMap[suggestion.mealType]}
                                    </h3>
                                    <span className="px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                        Đã duyệt
                                    </span>
                                </div>

                                {/* Thông tin cơ bản */}
                                <div className="grid md:grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                                    <div>
                                        <p className="font-semibold">Giáo viên đề xuất:</p>
                                        <p className="text-gray-600">{suggestion.teacherName}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Ngày áp dụng:</p>
                                        <p className="text-gray-600">{formatDate(suggestion.date)}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Thời gian đề xuất:</p>
                                        <p className="text-gray-600">
                                            {new Date(suggestion.createdAt).toLocaleString('vi-VN')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Thời gian phê duyệt:</p>
                                        <p className="text-gray-600">
                                            {suggestion.updatedAt ? new Date(suggestion.updatedAt).toLocaleString('vi-VN') : 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                {/* Món chính */}
                                <div className="border-t pt-4 mb-6">
                                    <h3 className="text-lg font-bold mb-4 bg-orange-100 p-2 rounded">Món chính</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="font-semibold">Tên món:</p>
                                            <p className="text-gray-600">{suggestion.mainDish.name}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Nguyên liệu:</p>
                                            <p className="text-gray-600">{suggestion.mainDish.ingredients}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Giá trị dinh dưỡng:</p>
                                            <p className="text-gray-600">{suggestion.mainDish.nutrition}</p>
                                        </div>
                                        {suggestion.mainDish.allergyInfo && (
                                            <div>
                                                <p className="font-semibold">Thông tin dị ứng:</p>
                                                <p className="text-red-600">{suggestion.mainDish.allergyInfo}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Món phụ */}
                                {suggestion.sideDish.name && (
                                    <div className="border-t pt-4 mb-6">
                                        <h3 className="text-lg font-bold mb-4 bg-green-100 p-2 rounded">Món phụ</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="font-semibold">Tên món:</p>
                                                <p className="text-gray-600">{suggestion.sideDish.name}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Nguyên liệu:</p>
                                                <p className="text-gray-600">{suggestion.sideDish.ingredients}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Giá trị dinh dưỡng:</p>
                                                <p className="text-gray-600">{suggestion.sideDish.nutrition}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Canh/Súp */}
                                {suggestion.soup.name && (
                                    <div className="border-t pt-4 mb-6">
                                        <h3 className="text-lg font-bold mb-4 bg-blue-100 p-2 rounded">Canh/Súp</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="font-semibold">Tên món:</p>
                                                <p className="text-gray-600">{suggestion.soup.name}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Nguyên liệu:</p>
                                                <p className="text-gray-600">{suggestion.soup.ingredients}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Giá trị dinh dưỡng:</p>
                                                <p className="text-gray-600">{suggestion.soup.nutrition}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Tráng miệng */}
                                {suggestion.dessert.name && (
                                    <div className="border-t pt-4 mb-6">
                                        <h3 className="text-lg font-bold mb-4 bg-purple-100 p-2 rounded">Tráng miệng</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="font-semibold">Tên món:</p>
                                                <p className="text-gray-600">{suggestion.dessert.name}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Nguyên liệu:</p>
                                                <p className="text-gray-600">{suggestion.dessert.ingredients}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Giá trị dinh dưỡng:</p>
                                                <p className="text-gray-600">{suggestion.dessert.nutrition}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Thông tin bổ sung */}
                                <div className="border-t pt-4 bg-gray-50 p-4 rounded-lg">
                                    <div className="mb-4">
                                        <p className="font-semibold">Lý do đề xuất:</p>
                                        <p className="text-gray-600">{suggestion.reason}</p>
                                    </div>
                                    {suggestion.note && (
                                        <div>
                                            <p className="font-semibold">Ghi chú thêm:</p>
                                            <p className="text-gray-600">{suggestion.note}</p>
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

export default ChefSuggestion; 