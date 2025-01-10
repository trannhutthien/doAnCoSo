import React, { useState, useEffect } from 'react';

function MenuManagement() {
    const [menus, setMenus] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [formData, setFormData] = useState({
        date: '',
        applyFor: {
            type: 'all_class',
            studentId: '',
            className: '',
            note: ''
        },
        meals: {
            breakfast: {
                name: '',
                calories: '',
                protein: '',
                carbs: '',
                fat: '',
                fiber: '',
                calcium: '',
                iron: '',
                vitaminA: '',
                vitaminC: '',
                sugar: '',
                sodium: '',
                cookingMethods: [],
                ageGroups: [],
                ingredients: []
            },
            lunch: {
                name: '',
                calories: '',
                protein: '',
                carbs: '',
                fat: '',
                fiber: '',
                calcium: '',
                iron: '',
                vitaminA: '',
                vitaminC: '',
                sugar: '',
                sodium: '',
                cookingMethods: [],
                ageGroups: [],
                ingredients: []
            },
            snack: {
                name: '',
                calories: '',
                protein: '',
                carbs: '',
                fat: '',
                fiber: '',
                calcium: '',
                iron: '',
                vitaminA: '',
                vitaminC: '',
                sugar: '',
                sodium: '',
                cookingMethods: [],
                ageGroups: [],
                ingredients: []
            }
        }
    });
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [selectedMenuForApply, setSelectedMenuForApply] = useState(null);
    const [applyDate, setApplyDate] = useState('');

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
            applyFor: {
                type: 'all_class',
                studentId: '',
                className: '',
                note: ''
            },
            meals: {
                breakfast: { name: '', calories: '', protein: '', carbs: '', fat: '', ageGroups: [], ingredients: [] },
                lunch: { name: '', calories: '', protein: '', carbs: '', fat: '', ageGroups: [], ingredients: [] },
                snack: { name: '', calories: '', protein: '', carbs: '', fat: '', ageGroups: [], ingredients: [] }
            }
        });
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
        newIngredients[index] = {
            ...newIngredients[index],
            [field]: value
        };
        
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

    const handleDeleteMenu = async (menuId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa thực đơn này không?')) {
            try {
                const response = await fetch(`http://localhost:3001/menus/${menuId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    fetchMenus();
                }
            } catch (error) {
                console.error('Lỗi khi xóa thực đơn:', error);
            }
        }
    };

    const handleEditMenu = (menu) => {
        setSelectedMenu(menu);
        setFormData({
            date: menu.date,
            applyFor: {
                type: menu.applyFor?.type || 'all_class',
                studentId: menu.applyFor?.studentId || '',
                className: menu.applyFor?.className || '',
                note: menu.applyFor?.note || ''
            },
            meals: {
                breakfast: {
                    name: menu.meals.breakfast?.name || '',
                    calories: menu.meals.breakfast?.calories || '',
                    protein: menu.meals.breakfast?.protein || '',
                    carbs: menu.meals.breakfast?.carbs || '',
                    fat: menu.meals.breakfast?.fat || '',
                    fiber: menu.meals.breakfast?.fiber || '',
                    calcium: menu.meals.breakfast?.calcium || '',
                    iron: menu.meals.breakfast?.iron || '',
                    vitaminA: menu.meals.breakfast?.vitaminA || '',
                    vitaminC: menu.meals.breakfast?.vitaminC || '',
                    sugar: menu.meals.breakfast?.sugar || '',
                    sodium: menu.meals.breakfast?.sodium || '',
                    cookingMethods: menu.meals.breakfast?.cookingMethods || [],
                    ageGroups: menu.meals.breakfast?.ageGroups || [],
                    ingredients: menu.meals.breakfast?.ingredients || []
                },
                lunch: {
                    name: menu.meals.lunch?.name || '',
                    calories: menu.meals.lunch?.calories || '',
                    protein: menu.meals.lunch?.protein || '',
                    carbs: menu.meals.lunch?.carbs || '',
                    fat: menu.meals.lunch?.fat || '',
                    fiber: menu.meals.lunch?.fiber || '',
                    calcium: menu.meals.lunch?.calcium || '',
                    iron: menu.meals.lunch?.iron || '',
                    vitaminA: menu.meals.lunch?.vitaminA || '',
                    vitaminC: menu.meals.lunch?.vitaminC || '',
                    sugar: menu.meals.lunch?.sugar || '',
                    sodium: menu.meals.lunch?.sodium || '',
                    cookingMethods: menu.meals.lunch?.cookingMethods || [],
                    ageGroups: menu.meals.lunch?.ageGroups || [],
                    ingredients: menu.meals.lunch?.ingredients || []
                },
                snack: {
                    name: menu.meals.snack?.name || '',
                    calories: menu.meals.snack?.calories || '',
                    protein: menu.meals.snack?.protein || '',
                    carbs: menu.meals.snack?.carbs || '',
                    fat: menu.meals.snack?.fat || '',
                    fiber: menu.meals.snack?.fiber || '',
                    calcium: menu.meals.snack?.calcium || '',
                    iron: menu.meals.snack?.iron || '',
                    vitaminA: menu.meals.snack?.vitaminA || '',
                    vitaminC: menu.meals.snack?.vitaminC || '',
                    sugar: menu.meals.snack?.sugar || '',
                    sodium: menu.meals.snack?.sodium || '',
                    cookingMethods: menu.meals.snack?.cookingMethods || [],
                    ageGroups: menu.meals.snack?.ageGroups || [],
                    ingredients: menu.meals.snack?.ingredients || []
                }
            }
        });
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleApplyMenu = async () => {
        if (!applyDate) {
            alert('Vui lòng chọn ngày áp dụng');
            return;
        }

        try {
            const newMenu = {
                ...selectedMenuForApply,
                id: undefined,
                date: applyDate
            };

            const response = await fetch('http://localhost:3001/menus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMenu),
            });

            if (response.ok) {
                alert('Áp dụng thực đơn thành công!');
                setShowApplyModal(false);
                setSelectedMenuForApply(null);
                setApplyDate('');
                fetchMenus();
            }
        } catch (error) {
            console.error('Lỗi khi áp dụng thực đơn:', error);
            alert('Có lỗi xảy ra khi áp dụng thực đơn');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Quản lý thực đơn</h2>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                        {selectedMenu ? 'Chỉnh sửa thực đơn' : 'Thêm thực đơn mới'}
                    </h3>
                    {selectedMenu && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            Hủy chỉnh sửa
                        </button>
                    )}
                </div>

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

                <div className="space-y-4">
                    <label className="block mb-2">Áp dụng cho</label>
                    <select
                        value={formData.applyFor.type}
                        onChange={(e) => setFormData({
                            ...formData,
                            applyFor: {
                                ...formData.applyFor,
                                type: e.target.value,
                                studentId: '',
                                className: '',
                                note: ''
                            }
                        })}
                        className="w-full border rounded px-3 py-2"
                        required
                    >
                        <option value="all_class">Tất cả các lớp</option>
                        <option value="specific_class">Lớp cụ thể</option>
                        <option value="specific_student">Học sinh cụ thể</option>
                        <option value="special_diet">Chế độ ăn đặc biệt</option>
                        <option value="event">Sự kiện đặc biệt</option>
                    </select>

                    {formData.applyFor.type === 'specific_class' && (
                        <div>
                            <label className="block mb-2">Chọn lớp</label>
                            <select
                                value={formData.applyFor.className}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    applyFor: {
                                        ...formData.applyFor,
                                        className: e.target.value
                                    }
                                })}
                                className="w-full border rounded px-3 py-2"
                                required
                            >
                                <option value="">Chọn lớp</option>
                                <option value="lop-mam">Lớp Mầm</option>
                                <option value="lop-choi">Lớp Chồi</option>
                                <option value="lop-la">Lớp Lá</option>
                                <option value="lop-mam-non">Lớp Mầm Non</option>
                            </select>
                        </div>
                    )}

                    {formData.applyFor.type === 'specific_student' && (
                        <div>
                            <label className="block mb-2">Mã học sinh</label>
                            <input
                                type="text"
                                value={formData.applyFor.studentId}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    applyFor: {
                                        ...formData.applyFor,
                                        studentId: e.target.value
                                    }
                                })}
                                className="w-full border rounded px-3 py-2"
                                placeholder="Nhập mã học sinh"
                                required
                            />
                        </div>
                    )}

                    {(formData.applyFor.type === 'special_diet' || formData.applyFor.type === 'event') && (
                        <div>
                            <label className="block mb-2">Ghi chú</label>
                            <textarea
                                value={formData.applyFor.note}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    applyFor: {
                                        ...formData.applyFor,
                                        note: e.target.value
                                    }
                                })}
                                className="w-full border rounded px-3 py-2"
                                placeholder={formData.applyFor.type === 'special_diet' 
                                    ? "Nhập thông tin về chế độ ăn đặc biệt..."
                                    : "Nhập thông tin về sự kiện..."}
                                rows="3"
                                required
                            />
                        </div>
                    )}
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
                                    { value: 'kho', label: 'Kho' },
                                    { value: 'ham', label: 'Hầm' },
                                    { value: 'soup', label: 'Súp' },
                                    { value: 'nuoc', label: 'Món nước' },
                                    { value: 'rang', label: 'Rang' },
                                    { value: 'muoi', label: 'Muối' },
                                    { value: 'uop', label: 'Ướp' },
                                    { value: 'ap_chao', label: 'Áp chảo' }
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

                        <div className="space-y-4">
                            <label className="block mb-2">Nguyên liệu</label>
                            {data.ingredients.map((ingredient, index) => (
                                <div key={index} className="flex items-center space-x-4">
                                    <input
                                        type="text"
                                        placeholder="Tên nguyên liệu"
                                        value={ingredient.name}
                                        onChange={(e) => updateIngredient(meal, index, 'name', e.target.value)}
                                        className="flex-1 border rounded px-3 py-2"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Số lượng"
                                        value={ingredient.amount}
                                        onChange={(e) => updateIngredient(meal, index, 'amount', e.target.value)}
                                        className="w-24 border rounded px-3 py-2"
                                    />
                                    <select
                                        value={ingredient.unit}
                                        onChange={(e) => updateIngredient(meal, index, 'unit', e.target.value)}
                                        className="w-24 border rounded px-3 py-2"
                                    >
                                        <option value="g">g</option>
                                        <option value="kg">kg</option>
                                        <option value="ml">ml</option>
                                        <option value="cái">cái</option>
                                        <option value="trái">trái</option>
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

                        <div className="space-y-4">
                            <label className="block font-medium text-gray-700">Thông tin dinh dưỡng</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block mb-2">Năng lượng (kcal)</label>
                                    <select
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
                                    >
                                        <option value="">Không</option>
                                        <option value="200">200 kcal</option>
                                        <option value="300">300 kcal</option>
                                        <option value="400">400 kcal</option>
                                        <option value="500">500 kcal</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2">Chất đạm (g)</label>
                                    <select
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
                                    >
                                        <option value="">Không</option>
                                        <option value="5">5g</option>
                                        <option value="10">10g</option>
                                        <option value="15">15g</option>
                                        <option value="20">20g</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2">Tinh bột (g)</label>
                                    <select
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
                                    >
                                        <option value="">Không</option>
                                        <option value="20">20g</option>
                                        <option value="30">30g</option>
                                        <option value="40">40g</option>
                                        <option value="50">50g</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2">Chất béo (g)</label>
                                    <select
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
                                    >
                                        <option value="">Không</option>
                                        <option value="5">5g</option>
                                        <option value="10">10g</option>
                                        <option value="15">15g</option>
                                        <option value="20">20g</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2">Chất xơ (g)</label>
                                    <select
                                        value={data.fiber}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            meals: {
                                                ...formData.meals,
                                                [meal]: { ...data, fiber: e.target.value }
                                            }
                                        })}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="">Không</option>
                                        <option value="2">2g</option>
                                        <option value="4">4g</option>
                                        <option value="6">6g</option>
                                        <option value="8">8g</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2">Đường (g)</label>
                                    <select
                                        value={data.sugar}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            meals: {
                                                ...formData.meals,
                                                [meal]: { ...data, sugar: e.target.value }
                                            }
                                        })}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="">Không</option>
                                        <option value="5">5g</option>
                                        <option value="10">10g</option>
                                        <option value="15">15g</option>
                                        <option value="20">20g</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2">Canxi (mg)</label>
                                    <select
                                        value={data.calcium}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            meals: {
                                                ...formData.meals,
                                                [meal]: { ...data, calcium: e.target.value }
                                            }
                                        })}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="">Không</option>
                                        <option value="100">100mg</option>
                                        <option value="200">200mg</option>
                                        <option value="300">300mg</option>
                                        <option value="400">400mg</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2">Sắt (mg)</label>
                                    <select
                                        value={data.iron}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            meals: {
                                                ...formData.meals,
                                                [meal]: { ...data, iron: e.target.value }
                                            }
                                        })}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="">Không</option>
                                        <option value="2">2mg</option>
                                        <option value="4">4mg</option>
                                        <option value="6">6mg</option>
                                        <option value="8">8mg</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2">Vitamin A (mcg)</label>
                                    <select
                                        value={data.vitaminA}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            meals: {
                                                ...formData.meals,
                                                [meal]: { ...data, vitaminA: e.target.value }
                                            }
                                        })}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="">Không</option>
                                        <option value="100">100mcg</option>
                                        <option value="200">200mcg</option>
                                        <option value="300">300mcg</option>
                                        <option value="400">400mcg</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2">Vitamin C (mg)</label>
                                    <select
                                        value={data.vitaminC}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            meals: {
                                                ...formData.meals,
                                                [meal]: { ...data, vitaminC: e.target.value }
                                            }
                                        })}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="">Không</option>
                                        <option value="10">10mg</option>
                                        <option value="20">20mg</option>
                                        <option value="30">30mg</option>
                                        <option value="40">40mg</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2">Natri (mg)</label>
                                    <select
                                        value={data.sodium}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            meals: {
                                                ...formData.meals,
                                                [meal]: { ...data, sodium: e.target.value }
                                            }
                                        })}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="">Không</option>
                                        <option value="100">100mg</option>
                                        <option value="200">200mg</option>
                                        <option value="300">300mg</option>
                                        <option value="400">400mg</option>
                                    </select>
                                </div>
                            </div>
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
                ))}

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                        {selectedMenu ? 'Hủy' : 'Đặt lại'}
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                        {selectedMenu ? 'Cập nhật' : 'Thêm mới'}
                    </button>
                </div>
            </form>

            <div className="mt-6 max-w-7xl mx-auto">
                <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Danh sách thực đơn</h3>
                
                {menus.map(menu => (
                    <div key={menu.id} className="mb-8 bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="bg-teal-500 text-white px-6 py-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="text-lg font-semibold">Thực đơn ngày: {menu.date}</h4>
                                    <p className="text-teal-100 text-sm mt-1">ID: {menu.id}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedMenuForApply(menu);
                                            setShowApplyModal(true);
                                        }}
                                        className="px-4 py-2 bg-green-400 hover:bg-green-500 text-white rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Áp dụng
                                    </button>
                                    <button
                                        onClick={() => handleEditMenu(menu)}
                                        className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Chỉnh sửa
                                    </button>
                                    <button
                                        onClick={() => handleDeleteMenu(menu.id)}
                                        className="px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Xóa thực đơn
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid md:grid-cols-3 gap-6">
                                {Object.entries(menu.meals).map(([meal, data]) => (
                                    <div key={meal} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-teal-200 transition-all">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className={`w-3 h-3 rounded-full ${
                                                meal === 'breakfast' ? 'bg-amber-300' :
                                                meal === 'lunch' ? 'bg-teal-300' : 'bg-sky-300'
                                            }`}></span>
                                            <h5 className="font-semibold text-gray-700 capitalize">
                                                {meal === 'breakfast' ? 'Bữa sáng' :
                                                 meal === 'lunch' ? 'Bữa trưa' : 'Bữa phụ'}
                                            </h5>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div className="bg-white p-3 rounded-md border border-gray-100">
                                                <p className="font-medium text-gray-800">{data.name}</p>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="bg-white p-2 rounded-md border border-gray-100">
                                                    <p className="text-sm text-gray-500">Calories</p>
                                                    <p className="font-medium text-teal-600">{data.calories} kcal</p>
                                                </div>
                                                <div className="bg-white p-2 rounded-md border border-gray-100">
                                                    <p className="text-sm text-gray-500">Protein</p>
                                                    <p className="font-medium text-teal-600">{data.protein}g</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                {[
                                                    { label: 'Chất đạm', value: data.protein, unit: 'g' },
                                                    { label: 'Tinh bột', value: data.carbs, unit: 'g' },
                                                    { label: 'Chất béo', value: data.fat, unit: 'g' },
                                                    { label: 'Chất xơ', value: data.fiber, unit: 'g' },
                                                    { label: 'Canxi', value: data.calcium, unit: 'mg' },
                                                    { label: 'Sắt', value: data.iron, unit: 'mg' },
                                                    { label: 'Vitamin A', value: data.vitaminA, unit: 'mcg' },
                                                    { label: 'Vitamin C', value: data.vitaminC, unit: 'mg' },
                                                    { label: 'Đường', value: data.sugar, unit: 'g' },
                                                    { label: 'Natri', value: data.sodium, unit: 'mg' }
                                                ].map(nutrient => nutrient.value && (
                                                    <div key={nutrient.label} className="bg-white p-2 rounded-md border border-gray-100">
                                                        <p className="text-sm text-gray-500">{nutrient.label}</p>
                                                        <p className="font-medium text-teal-600">{nutrient.value}{nutrient.unit}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {data.cookingMethods?.length > 0 && (
                                                <div className="bg-white p-3 rounded-md border border-gray-100">
                                                    <p className="text-sm text-gray-500 mb-2">Cách chế biến:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {data.cookingMethods.map(method => (
                                                            <span key={method} className="px-2 py-1 bg-teal-50 text-teal-700 rounded-full text-sm">
                                                                {method}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {data.ingredients?.length > 0 && (
                                                <div className="bg-white p-3 rounded-md border border-gray-100">
                                                    <p className="text-sm text-gray-500 mb-2">Nguyên liệu:</p>
                                                    <div className="space-y-1">
                                                        {data.ingredients.map((ingredient, idx) => (
                                                            <p key={idx} className="text-sm">
                                                                {ingredient.name}: {ingredient.amount} {ingredient.unit}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {data.ageGroups?.length > 0 && (
                                                <div className="bg-white p-3 rounded-md border border-gray-100">
                                                    <p className="text-sm text-gray-500 mb-2">Độ tuổi phù hợp:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {data.ageGroups.map(age => (
                                                            <span key={age} className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                                                                {age} tuổi
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <span className="font-medium">Áp dụng cho:</span>
                                        <span>
                                            {menu.applyFor && menu.applyFor.type ? (
                                                menu.applyFor.type === 'all_class' ? 'Tất cả các lớp' :
                                                menu.applyFor.type === 'specific_class' ? `Lớp ${menu.applyFor.className}` :
                                                menu.applyFor.type === 'specific_student' ? `Học sinh: ${menu.applyFor.studentId}` :
                                                menu.applyFor.type === 'special_diet' ? 'Chế độ ăn đặc biệt' : 'Sự kiện đặc biệt'
                                            ) : 'Không xác định'}
                                        </span>
                                    </div>
                                    {menu.applyFor?.note && (
                                        <div className="text-sm text-gray-600 ml-7">
                                            <span className="font-medium">Ghi chú:</span> {menu.applyFor.note}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showApplyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-xl font-semibold mb-4">Áp dụng thực đơn cho ngày khác</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Chọn ngày áp dụng
                            </label>
                            <input
                                type="date"
                                value={applyDate}
                                onChange={(e) => setApplyDate(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2"
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowApplyModal(false);
                                    setSelectedMenuForApply(null);
                                    setApplyDate('');
                                }}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleApplyMenu}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MenuManagement; 