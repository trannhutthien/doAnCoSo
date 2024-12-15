import React, { useState } from 'react';

function MenuSuggestion() {
    const [suggestion, setSuggestion] = useState({
        dishName: '',
        ingredients: '',
        nutritionInfo: {
            calories: '',
            protein: '',
            carbs: '',
            fat: ''
        },
        ageGroup: '3-4'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/menu_suggestions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...suggestion,
                    teacherId: 'GV001',
                    ingredients: suggestion.ingredients.split(',').map(i => i.trim()),
                    status: 'pending'
                }),
            });

            if (response.ok) {
                alert('Đề xuất thực đơn đã được gửi thành công!');
                setSuggestion({
                    dishName: '',
                    ingredients: '',
                    nutritionInfo: {
                        calories: '',
                        protein: '',
                        carbs: '',
                        fat: ''
                    },
                    ageGroup: '3-4'
                });
            }
        } catch (error) {
            console.error('Error submitting suggestion:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Đề xuất thực đơn mới</h2>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                <div>
                    <label className="block mb-2">Tên món ăn</label>
                    <input
                        type="text"
                        value={suggestion.dishName}
                        onChange={(e) => setSuggestion({ ...suggestion, dishName: e.target.value })}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2">Nguyên liệu (phân cách bằng dấu phẩy)</label>
                    <textarea
                        value={suggestion.ingredients}
                        onChange={(e) => setSuggestion({ ...suggestion, ingredients: e.target.value })}
                        className="w-full border rounded px-3 py-2 h-24"
                        placeholder="Ví dụ: Gạo, thịt gà, cà rốt, ..."
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-2">Calories</label>
                        <input
                            type="number"
                            value={suggestion.nutritionInfo.calories}
                            onChange={(e) => setSuggestion({
                                ...suggestion,
                                nutritionInfo: { ...suggestion.nutritionInfo, calories: e.target.value }
                            })}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Protein (g)</label>
                        <input
                            type="text"
                            value={suggestion.nutritionInfo.protein}
                            onChange={(e) => setSuggestion({
                                ...suggestion,
                                nutritionInfo: { ...suggestion.nutritionInfo, protein: e.target.value }
                            })}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Carbs (g)</label>
                        <input
                            type="text"
                            value={suggestion.nutritionInfo.carbs}
                            onChange={(e) => setSuggestion({
                                ...suggestion,
                                nutritionInfo: { ...suggestion.nutritionInfo, carbs: e.target.value }
                            })}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Chất béo (g)</label>
                        <input
                            type="text"
                            value={suggestion.nutritionInfo.fat}
                            onChange={(e) => setSuggestion({
                                ...suggestion,
                                nutritionInfo: { ...suggestion.nutritionInfo, fat: e.target.value }
                            })}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block mb-2">Nhóm tuổi</label>
                    <select
                        value={suggestion.ageGroup}
                        onChange={(e) => setSuggestion({ ...suggestion, ageGroup: e.target.value })}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="3-4">3-4 tuổi</option>
                        <option value="4-5">4-5 tuổi</option>
                        <option value="5-6">5-6 tuổi</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                >
                    Gửi đề xuất
                </button>
            </form>
        </div>
    );
}

export default MenuSuggestion; 