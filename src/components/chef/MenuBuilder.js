import React, { useState, useEffect } from 'react';

function MenuBuilder() {
    const [dishes, setDishes] = useState([]);
    const [selectedDish, setSelectedDish] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'món chính',
        ingredients: [{ name: '', amount: '', unit: 'g' }],
        nutrition: {
            calories: '',
            protein: '',
            carbs: '',
            fat: ''
        },
        recipe: ''
    });

    useEffect(() => {
        fetchDishes();
    }, []);

    const fetchDishes = async () => {
        try {
            const response = await fetch('http://localhost:3001/dishes');
            const data = await response.json();
            setDishes(data);
        } catch (error) {
            console.error('Error fetching dishes:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = selectedDish ? 'PUT' : 'POST';
            const url = selectedDish
                ? `http://localhost:3001/dishes/${selectedDish.id}`
                : 'http://localhost:3001/dishes';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    usageCount: selectedDish ? selectedDish.usageCount : 0,
                    rating: selectedDish ? selectedDish.rating : 0
                }),
            });

            if (response.ok) {
                fetchDishes();
                resetForm();
            }
        } catch (error) {
            console.error('Error saving dish:', error);
        }
    };

    const addIngredient = () => {
        setFormData({
            ...formData,
            ingredients: [...formData.ingredients, { name: '', amount: '', unit: 'g' }]
        });
    };

    const removeIngredient = (index) => {
        setFormData({
            ...formData,
            ingredients: formData.ingredients.filter((_, i) => i !== index)
        });
    };

    const resetForm = () => {
        setSelectedDish(null);
        setFormData({
            name: '',
            category: 'món chính',
            ingredients: [{ name: '', amount: '', unit: 'g' }],
            nutrition: {
                calories: '',
                protein: '',
                carbs: '',
                fat: ''
            },
            recipe: ''
        });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Quản lý món ăn</h2>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-2">Tên món</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Phân loại</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="món chính">Món chính</option>
                            <option value="món phụ">Món phụ</option>
                            <option value="tráng miệng">Tráng miệng</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block mb-2">Nguyên liệu</label>
                    {formData.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex space-x-4 mb-2">
                            <input
                                type="text"
                                value={ingredient.name}
                                onChange={(e) => {
                                    const newIngredients = [...formData.ingredients];
                                    newIngredients[index].name = e.target.value;
                                    setFormData({ ...formData, ingredients: newIngredients });
                                }}
                                className="flex-1 border rounded px-3 py-2"
                                placeholder="Tên nguyên liệu"
                                required
                            />
                            <input
                                type="number"
                                value={ingredient.amount}
                                onChange={(e) => {
                                    const newIngredients = [...formData.ingredients];
                                    newIngredients[index].amount = e.target.value;
                                    setFormData({ ...formData, ingredients: newIngredients });
                                }}
                                className="w-24 border rounded px-3 py-2"
                                placeholder="Số lượng"
                                required
                            />
                            <select
                                value={ingredient.unit}
                                onChange={(e) => {
                                    const newIngredients = [...formData.ingredients];
                                    newIngredients[index].unit = e.target.value;
                                    setFormData({ ...formData, ingredients: newIngredients });
                                }}
                                className="w-24 border rounded px-3 py-2"
                            >
                                <option value="g">g</option>
                                <option value="ml">ml</option>
                                <option value="cái">cái</option>
                            </select>
                            <button
                                type="button"
                                onClick={() => removeIngredient(index)}
                                className="text-red-600 hover:text-red-800"
                            >
                                Xóa
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addIngredient}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        + Thêm nguyên liệu
                    </button>
                </div>

                <div>
                    <label className="block mb-2">Giá trị dinh dưỡng</label>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm">Calories</label>
                            <input
                                type="number"
                                value={formData.nutrition.calories}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    nutrition: { ...formData.nutrition, calories: e.target.value }
                                })}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm">Protein (g)</label>
                            <input
                                type="text"
                                value={formData.nutrition.protein}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    nutrition: { ...formData.nutrition, protein: e.target.value }
                                })}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm">Carbs (g)</label>
                            <input
                                type="text"
                                value={formData.nutrition.carbs}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    nutrition: { ...formData.nutrition, carbs: e.target.value }
                                })}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm">Fat (g)</label>
                            <input
                                type="text"
                                value={formData.nutrition.fat}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    nutrition: { ...formData.nutrition, fat: e.target.value }
                                })}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block mb-2">Cách chế biến</label>
                    <textarea
                        value={formData.recipe}
                        onChange={(e) => setFormData({ ...formData, recipe: e.target.value })}
                        className="w-full border rounded px-3 py-2 h-32"
                        placeholder="Nhập các bước chế biến..."
                        required
                    />
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                    >
                        {selectedDish ? 'Cập nhật' : 'Thêm mới'}
                    </button>
                </div>
            </form>

            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-4">Danh sách món ăn</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {dishes.map(dish => (
                        <div key={dish.id} className="border rounded p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-medium">{dish.name}</h4>
                                    <p className="text-sm text-gray-600 capitalize">{dish.category}</p>
                                </div>
                                <div className="space-x-2">
                                    <button
                                        onClick={() => setSelectedDish(dish)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Bạn có chắc muốn xóa món này?')) {
                                                fetch(`http://localhost:3001/dishes/${dish.id}`, {
                                                    method: 'DELETE',
                                                }).then(() => fetchDishes());
                                            }
                                        }}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm">
                                Calories: {dish.nutrition.calories},
                                Protein: {dish.nutrition.protein},
                                Carbs: {dish.nutrition.carbs}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MenuBuilder; 