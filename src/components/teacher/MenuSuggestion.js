import React, { useState } from 'react';
import axios from 'axios';

function MenuSuggestion() {
    const [suggestion, setSuggestion] = useState({
        date: '',
        mealType: 'lunch', // lunch, snack
        mainDish: {
            name: '',
            ingredients: '',
            nutrition: '',
            allergyInfo: ''
        },
        sideDish: {
            name: '',
            ingredients: '',
            nutrition: ''
        },
        soup: {
            name: '',
            ingredients: '',
            nutrition: ''
        },
        dessert: {
            name: '',
            ingredients: '',
            nutrition: ''
        },
        note: '',
        reason: ''
    });

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e, category, field) => {
        if (category) {
            setSuggestion(prev => ({
                ...prev,
                [category]: {
                    ...prev[category],
                    [field]: e.target.value
                }
            }));
        } else {
            setSuggestion(prev => ({
                ...prev,
                [e.target.name]: e.target.value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const suggestionData = {
                ...suggestion,
                teacherId: user.id,
                teacherName: user.name,
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            await axios.post('http://localhost:3001/menu_suggestions', suggestionData);
            setMessage('Đề xuất thực đơn đã được gửi thành công!');
            // Reset form
            setSuggestion({
                date: '',
                mealType: 'lunch',
                mainDish: { name: '', ingredients: '', nutrition: '', allergyInfo: '' },
                sideDish: { name: '', ingredients: '', nutrition: '' },
                soup: { name: '', ingredients: '', nutrition: '' },
                dessert: { name: '', ingredients: '', nutrition: '' },
                note: '',
                reason: ''
            });
        } catch (error) {
            setMessage('Lỗi: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Đề xuất thực đơn</h2>

            {message && (
                <div className={`p-4 mb-4 rounded ${
                    message.includes('Lỗi') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-2">Ngày đề xuất</label>
                        <input
                            type="date"
                            name="date"
                            value={suggestion.date}
                            onChange={(e) => handleChange(e)}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Loại bữa ăn</label>
                        <select
                            name="mealType"
                            value={suggestion.mealType}
                            onChange={(e) => handleChange(e)}
                            className="w-full border rounded px-3 py-2"
                            required
                        >
                            <option value="lunch">Bữa trưa</option>
                            <option value="snack">Bữa phụ</option>
                        </select>
                    </div>
                </div>

                {/* Món chính */}
                <div className="border p-4 rounded">
                    <h3 className="font-bold mb-4">Món chính</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">Tên món</label>
                            <input
                                type="text"
                                value={suggestion.mainDish.name}
                                onChange={(e) => handleChange(e, 'mainDish', 'name')}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Nguyên liệu chính</label>
                            <input
                                type="text"
                                value={suggestion.mainDish.ingredients}
                                onChange={(e) => handleChange(e, 'mainDish', 'ingredients')}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Giá trị dinh dưỡng</label>
                            <input
                                type="text"
                                value={suggestion.mainDish.nutrition}
                                onChange={(e) => handleChange(e, 'mainDish', 'nutrition')}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Thông tin dị ứng</label>
                            <input
                                type="text"
                                value={suggestion.mainDish.allergyInfo}
                                onChange={(e) => handleChange(e, 'mainDish', 'allergyInfo')}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                    </div>
                </div>

                {/* Món phụ */}
                <div className="border p-4 rounded">
                    <h3 className="font-bold mb-4">Món phụ</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">Tên món</label>
                            <input
                                type="text"
                                value={suggestion.sideDish.name}
                                onChange={(e) => handleChange(e, 'sideDish', 'name')}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Nguyên liệu</label>
                            <input
                                type="text"
                                value={suggestion.sideDish.ingredients}
                                onChange={(e) => handleChange(e, 'sideDish', 'ingredients')}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Giá trị dinh dưỡng</label>
                            <input
                                type="text"
                                value={suggestion.sideDish.nutrition}
                                onChange={(e) => handleChange(e, 'sideDish', 'nutrition')}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                    </div>
                </div>

                {/* Canh */}
                <div className="border p-4 rounded">
                    <h3 className="font-bold mb-4">Canh/Súp</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">Tên món</label>
                            <input
                                type="text"
                                value={suggestion.soup.name}
                                onChange={(e) => handleChange(e, 'soup', 'name')}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Nguyên liệu</label>
                            <input
                                type="text"
                                value={suggestion.soup.ingredients}
                                onChange={(e) => handleChange(e, 'soup', 'ingredients')}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Giá trị dinh dưỡng</label>
                            <input
                                type="text"
                                value={suggestion.soup.nutrition}
                                onChange={(e) => handleChange(e, 'soup', 'nutrition')}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                    </div>
                </div>

                {/* Tráng miệng */}
                <div className="border p-4 rounded">
                    <h3 className="font-bold mb-4">Tráng miệng</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">Tên món</label>
                            <input
                                type="text"
                                value={suggestion.dessert.name}
                                onChange={(e) => handleChange(e, 'dessert', 'name')}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Nguyên liệu</label>
                            <input
                                type="text"
                                value={suggestion.dessert.ingredients}
                                onChange={(e) => handleChange(e, 'dessert', 'ingredients')}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Giá trị dinh dưỡng</label>
                            <input
                                type="text"
                                value={suggestion.dessert.nutrition}
                                onChange={(e) => handleChange(e, 'dessert', 'nutrition')}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block mb-2">Lý do đề xuất</label>
                    <textarea
                        name="reason"
                        value={suggestion.reason}
                        onChange={(e) => handleChange(e)}
                        className="w-full border rounded px-3 py-2 h-24"
                        placeholder="Giải thích lý do đề xuất thực đơn này..."
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2">Ghi chú thêm</label>
                    <textarea
                        name="note"
                        value={suggestion.note}
                        onChange={(e) => handleChange(e)}
                        className="w-full border rounded px-3 py-2 h-24"
                        placeholder="Thông tin bổ sung khác..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {loading ? 'Đang gửi...' : 'Gửi đề xuất'}
                </button>
            </form>
        </div>
    );
}

export default MenuSuggestion; 