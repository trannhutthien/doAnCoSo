import React, { useState, useEffect } from 'react';

function TeacherMenu() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [menuData, setMenuData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [evaluation, setEvaluation] = useState({
        mealType: 'breakfast',
        ratings: {
            taste: 5,
            nutrition: 5,
            presentation: 5,
            temperature: 5,
            portion: 5
        },
        ageGroupSuitability: {
            '2-3': true,
            '3-4': true,
            '4-5': true,
            '5-6': true
        },
        comments: '',
        suggestions: ''
    });

    useEffect(() => {
        fetchMenuData();
    }, [selectedDate]);

    const fetchMenuData = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching menu for date:', selectedDate.toISOString().split('T')[0]);

            const response = await fetch(
                `http://localhost:3001/menus?date=${selectedDate.toISOString().split('T')[0]}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch menu data');
            }

            const data = await response.json();
            console.log('Received menu data:', data);

            if (data && data.length > 0) {
                setMenuData(data[0]);
            } else {
                setError('Không có thực đơn cho ngày này');
            }
        } catch (error) {
            console.error('Error fetching menu data:', error);
            setError('Lỗi khi tải thực đơn: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEvaluationSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/menu_evaluations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    menuId: menuData.id,
                    teacherId: 'GV001', // Lấy từ context hoặc state
                    date: selectedDate.toISOString().split('T')[0],
                    ...evaluation
                }),
            });

            if (response.ok) {
                alert('Đánh giá thực đơn đã được gửi thành công!');
            }
        } catch (error) {
            console.error('Error submitting evaluation:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Thực đơn và Đánh giá</h2>
                <input
                    type="date"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    className="border rounded px-3 py-1"
                />
            </div>

            {loading && (
                <div className="text-center py-4">
                    <p>Đang tải thực đơn...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>{error}</p>
                </div>
            )}

            {menuData && menuData.meals && (
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Hiển thị thực đơn */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Thực đơn ngày {selectedDate.toLocaleDateString('vi-VN')}</h3>
                        {Object.entries(menuData.meals).map(([meal, data]) => (
                            <div key={meal} className="bg-white rounded-lg shadow p-4">
                                <h4 className="font-medium capitalize mb-2">
                                    {meal === 'breakfast' ? 'Bữa sáng' :
                                        meal === 'lunch' ? 'Bữa trưa' :
                                            meal === 'snack' ? 'Bữa phụ' : meal}
                                </h4>
                                <p className="text-lg mb-2">{data.name}</p>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>Calories: {data.calories}</div>
                                    <div>Protein: {data.protein}</div>
                                    <div>Carbs: {data.carbs}</div>
                                    <div>Fat: {data.fat}</div>
                                </div>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-600">
                                        Phù hợp độ tuổi: {data.ageGroups.join(', ')} tuổi
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Form đánh giá */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-xl font-semibold mb-4">Đánh giá thực đơn</h3>
                        <form onSubmit={handleEvaluationSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-2">Bữa ăn</label>
                                <select
                                    value={evaluation.mealType}
                                    onChange={(e) => setEvaluation({ ...evaluation, mealType: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="breakfast">Bữa sáng</option>
                                    <option value="lunch">Bữa trưa</option>
                                    <option value="snack">Bữa phụ</option>
                                </select>
                            </div>

                            <div>
                                <label className="block mb-2">Đánh giá chi tiết</label>
                                {Object.entries(evaluation.ratings).map(([criterion, rating]) => (
                                    <div key={criterion} className="flex items-center justify-between mb-2">
                                        <span className="capitalize">{criterion}</span>
                                        <input
                                            type="range"
                                            min="1"
                                            max="5"
                                            value={rating}
                                            onChange={(e) => setEvaluation({
                                                ...evaluation,
                                                ratings: {
                                                    ...evaluation.ratings,
                                                    [criterion]: parseInt(e.target.value)
                                                }
                                            })}
                                            className="w-1/2"
                                        />
                                        <span>{rating}/5</span>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <label className="block mb-2">Phù hợp với độ tuổi</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(evaluation.ageGroupSuitability).map(([age, suitable]) => (
                                        <label key={age} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={suitable}
                                                onChange={(e) => setEvaluation({
                                                    ...evaluation,
                                                    ageGroupSuitability: {
                                                        ...evaluation.ageGroupSuitability,
                                                        [age]: e.target.checked
                                                    }
                                                })}
                                                className="mr-2"
                                            />
                                            {age} tuổi
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2">Nhận xét</label>
                                <textarea
                                    value={evaluation.comments}
                                    onChange={(e) => setEvaluation({ ...evaluation, comments: e.target.value })}
                                    className="w-full border rounded px-3 py-2 h-24"
                                    placeholder="Nhận xét về thực đơn..."
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Đề xuất điều chỉnh</label>
                                <textarea
                                    value={evaluation.suggestions}
                                    onChange={(e) => setEvaluation({ ...evaluation, suggestions: e.target.value })}
                                    className="w-full border rounded px-3 py-2 h-24"
                                    placeholder="Đề xuất điều chỉnh nếu cần..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                            >
                                Gửi đánh giá
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {!loading && !menuData && !error && (
                <div className="text-center py-4">
                    <p>Không có thực đơn cho ngày này</p>
                </div>
            )}
        </div>
    );
}

export default TeacherMenu; 