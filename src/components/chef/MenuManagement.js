import React, { useState, useEffect } from 'react';

function MenuManagement() {
    const [menus, setMenus] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [formData, setFormData] = useState({
        date: '',
        meals: {
            breakfast: {
                name: '',
                cookingMethods: [],
                ingredients: []
            },
            lunch: {
                name: '',
                cookingMethods: [],
                ingredients: []
            },
            snack: {
                name: '',
                cookingMethods: [],
                ingredients: []
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
                breakfast: { name: '', cookingMethods: [], ingredients: [] },
                lunch: { name: '', cookingMethods: [], ingredients: [] },
                snack: { name: '', cookingMethods: [], ingredients: [] }
            }
        });
    };

    const handleEditMenu = (menu) => {
        setSelectedMenu(menu);
        setFormData({
            date: menu.date,
            meals: {
                breakfast: {
                    name: menu.meals.breakfast?.name || '',
                    cookingMethods: menu.meals.breakfast?.cookingMethods || [],
                    ingredients: menu.meals.breakfast?.ingredients || []
                },
                lunch: {
                    name: menu.meals.lunch?.name || '',
                    cookingMethods: menu.meals.lunch?.cookingMethods || [],
                    ingredients: menu.meals.lunch?.ingredients || []
                },
                snack: {
                    name: menu.meals.snack?.name || '',
                    cookingMethods: menu.meals.snack?.cookingMethods || [],
                    ingredients: menu.meals.snack?.ingredients || []
                }
            }
        });
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const addIngredient = (meal) => {
        const newIngredient = {
            name: '',
            amount: '',
            unit: 'g'
        };
        
        setFormData({
            ...formData,
            meals: {
                ...formData.meals,
                [meal]: {
                    ...formData.meals[meal],
                    ingredients: [...formData.meals[meal].ingredients, newIngredient]
                }
            }
        });
    };

    const removeIngredient = (meal, index) => {
        const newIngredients = [...formData.meals[meal].ingredients];
        newIngredients.splice(index, 1);
        
        setFormData({
            ...formData,
            meals: {
                ...formData.meals,
                [meal]: {
                    ...formData.meals[meal],
                    ingredients: newIngredients
                }
            }
        });
    };

    const updateIngredient = (meal, index, field, value) => {
        const newIngredients = [...formData.meals[meal].ingredients];
        newIngredients[index][field] = value;
        
        setFormData({
            ...formData,
            meals: {
                ...formData.meals,
                [meal]: {
                    ...formData.meals[meal],
                    ingredients: newIngredients
                }
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Quản lý thực đơn</h2>
            </div>

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
                    <div key={meal} className="space-y-4 border-b pb-6 mb-6">
                        <h3 className="font-semibold text-lg capitalize">
                            {meal === 'breakfast' ? 'Bữa sáng' :
                             meal === 'lunch' ? 'Bữa trưa' :
                             meal === 'snack' ? 'Bữa phụ' : meal}
                        </h3>

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
                            <label className="block mb-2">Cách chế biến</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {[
                                    { value: 'xao', label: 'Xào' },
                                    { value: 'luoc', label: 'Luộc' },
                                    { value: 'hap', label: 'Hấp' },
                                    { value: 'chien', label: 'Chiên' },
                                    { value: 'nuong', label: 'Nướng' },
                                    { value: 'kho', label: 'Kho' }
                                ].map(method => (
                                    <label key={method.value} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={data.cookingMethods?.includes(method.value)}
                                            onChange={(e) => {
                                                const newMethods = e.target.checked
                                                    ? [...(data.cookingMethods || []), method.value]
                                                    : (data.cookingMethods || []).filter(m => m !== method.value);
                                                setFormData({
                                                    ...formData,
                                                    meals: {
                                                        ...formData.meals,
                                                        [meal]: { ...data, cookingMethods: newMethods }
                                                    }
                                                });
                                            }}
                                            className="rounded"
                                        />
                                        <span>{method.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2">Nguyên liệu</label>
                            {data.ingredients.map((ingredient, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={ingredient.name}
                                        onChange={(e) => updateIngredient(meal, index, 'name', e.target.value)}
                                        placeholder="Tên nguyên liệu"
                                        className="flex-1 border rounded px-3 py-2"
                                    />
                                    <input
                                        type="text"
                                        value={ingredient.amount}
                                        onChange={(e) => updateIngredient(meal, index, 'amount', e.target.value)}
                                        placeholder="Số lượng"
                                        className="w-24 border rounded px-3 py-2"
                                    />
                                    <select
                                        value={ingredient.unit}
                                        onChange={(e) => updateIngredient(meal, index, 'unit', e.target.value)}
                                        className="w-24 border rounded px-3 py-2"
                                    >
                                        <option value="g">g</option>
                                        <option value="ml">ml</option>
                                        <option value="cái">cái</option>
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => removeIngredient(meal, index)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addIngredient(meal)}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                + Thêm nguyên liệu
                            </button>
                        </div>
                    </div>
                ))}

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        {selectedMenu ? 'Cập nhật' : 'Thêm mới'}
                    </button>
                </div>
            </form>

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Danh sách thực đơn</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menus.map(menu => (
                        <div key={menu.id} className="bg-white rounded-lg shadow p-4">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm text-gray-500">{menu.date}</span>
                                <button
                                    onClick={() => handleEditMenu(menu)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Chỉnh sửa
                                </button>
                            </div>
                            {Object.entries(menu.meals).map(([meal, data]) => (
                                <div key={meal} className="mb-4">
                                    <h4 className="font-medium text-gray-700">
                                        {meal === 'breakfast' ? 'Bữa sáng' :
                                         meal === 'lunch' ? 'Bữa trưa' : 'Bữa phụ'}
                                    </h4>
                                    <p className="text-gray-600">{data.name}</p>
                                    {data.cookingMethods?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {data.cookingMethods.map(method => (
                                                <span key={method} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                                                    {method}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MenuManagement; 