import React, { useState, useEffect } from 'react';

function MenuManagement() {
    const [menus, setMenus] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [formData, setFormData] = useState({
        date: '',
        meals: {
            breakfast: {
                name: '',
                calories: '',
                protein: '',
                carbs: '',
                fat: '',
                ageGroups: []
            },
            lunch: {
                name: '',
                calories: '',
                protein: '',
                carbs: '',
                fat: '',
                ageGroups: []
            },
            snack: {
                name: '',
                calories: '',
                protein: '',
                carbs: '',
                fat: '',
                ageGroups: []
            }
        }
    });

    useEffect(() => {
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        try {
            const response = await fetch('http://localhost:3001/menus');
            const data = await response.json();
            setMenus(data);
        } catch (error) {
            console.error('Error fetching menus:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = selectedMenu ? 'PUT' : 'POST';
            const url = selectedMenu
                ? `http://localhost:3001/menus/${selectedMenu.id}`
                : 'http://localhost:3001/menus';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                fetchMenus();
                resetForm();
            }
        } catch (error) {
            console.error('Error saving menu:', error);
        }
    };

    const resetForm = () => {
        setSelectedMenu(null);
        setFormData({
            date: '',
            meals: {
                breakfast: { name: '', calories: '', protein: '', carbs: '', fat: '', ageGroups: [] },
                lunch: { name: '', calories: '', protein: '', carbs: '', fat: '', ageGroups: [] },
                snack: { name: '', calories: '', protein: '', carbs: '', fat: '', ageGroups: [] }
            }
        });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Quản lý thực đơn</h2>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                <div>
                    <label className="block mb-2">Ngày</label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                {Object.entries(formData.meals).map(([meal, data]) => (
                    <div key={meal} className="space-y-4">
                        <h3 className="text-lg font-semibold capitalize">
                            {meal === 'breakfast' ? 'Bữa sáng' :
                                meal === 'lunch' ? 'Bữa trưa' :
                                    'Bữa phụ'}
                        </h3>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2">Tên món</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        meals: {
                                            ...formData.meals,
                                            [meal]: { ...data, name: e.target.value }
                                        }
                                    })}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Calories</label>
                                <input
                                    type="number"
                                    value={data.calories}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        meals: {
                                            ...formData.meals,
                                            [meal]: { ...data, calories: e.target.value }
                                        }
                                    })}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Protein (g)</label>
                                <input
                                    type="text"
                                    value={data.protein}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        meals: {
                                            ...formData.meals,
                                            [meal]: { ...data, protein: e.target.value }
                                        }
                                    })}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Carbs (g)</label>
                                <input
                                    type="text"
                                    value={data.carbs}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        meals: {
                                            ...formData.meals,
                                            [meal]: { ...data, carbs: e.target.value }
                                        }
                                    })}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Fat (g)</label>
                                <input
                                    type="text"
                                    value={data.fat}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        meals: {
                                            ...formData.meals,
                                            [meal]: { ...data, fat: e.target.value }
                                        }
                                    })}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2">Độ tuổi phù hợp</label>
                                <div className="space-y-2">
                                    {['2-3', '3-4', '4-5', '5-6'].map(age => (
                                        <label key={age} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={data.ageGroups.includes(age)}
                                                onChange={(e) => {
                                                    const newAgeGroups = e.target.checked
                                                        ? [...data.ageGroups, age]
                                                        : data.ageGroups.filter(g => g !== age);
                                                    setFormData({
                                                        ...formData,
                                                        meals: {
                                                            ...formData.meals,
                                                            [meal]: { ...data, ageGroups: newAgeGroups }
                                                        }
                                                    });
                                                }}
                                                className="mr-2"
                                            />
                                            {age} tuổi
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

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
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                        {selectedMenu ? 'Cập nhật' : 'Thêm mới'}
                    </button>
                </div>
            </form>

            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-4">Danh sách thực đơn</h3>
                <div className="space-y-4">
                    {menus.map(menu => (
                        <div key={menu.id} className="border rounded p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-medium">
                                    Thực đơn ngày {new Date(menu.date).toLocaleDateString('vi-VN')}
                                </h4>
                                <div className="space-x-2">
                                    <button
                                        onClick={() => setSelectedMenu(menu)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Bạn có chắc muốn xóa thực đơn này?')) {
                                                fetch(`http://localhost:3001/menus/${menu.id}`, {
                                                    method: 'DELETE',
                                                }).then(() => fetchMenus());
                                            }
                                        }}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                {Object.entries(menu.meals).map(([meal, data]) => (
                                    <div key={meal} className="border rounded p-3">
                                        <h5 className="font-medium capitalize mb-2">
                                            {meal === 'breakfast' ? 'Bữa sáng' :
                                                meal === 'lunch' ? 'Bữa trưa' :
                                                    'Bữa phụ'}
                                        </h5>
                                        <p>{data.name}</p>
                                        <p className="text-sm text-gray-600">
                                            Calories: {data.calories}, Protein: {data.protein}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MenuManagement; 