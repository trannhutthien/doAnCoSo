import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function MenuManagement() {
    const [menus, setMenus] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [filteredMenus, setFilteredMenus] = useState([]);
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
    const [selectedMeal, setSelectedMeal] = useState('breakfast');
    const [savedMeals, setSavedMeals] = useState([]);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [selectedMenuForApply, setSelectedMenuForApply] = useState(null);
    const [applyDate, setApplyDate] = useState('');

    useEffect(() => {
        fetchMenus();
    }, []);

    useEffect(() => {
        if (selectedDate) {
            const filtered = menus.filter(menu => menu.date === selectedDate);
            setFilteredMenus(filtered);
        } else {
            setFilteredMenus([]);
        }
    }, [selectedDate, menus]);

    const fetchMenus = async () => {
        try {
            const response = await fetch('http://localhost:3001/menus');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setMenus(data);
            console.log("Đã tải thực đơn:", data.length, "items");
        } catch (error) {
            console.error('Error fetching menus:', error);
            toast.error('Không thể tải danh sách thực đơn. Vui lòng thử lại sau.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.date) {
            toast.error('Vui lòng chọn ngày');
            return;
        }
        
        if (savedMeals.length === 0) {
            toast.error('Vui lòng thêm ít nhất một bữa ăn');
            return;
        }
        
        // Chỉ gửi các bữa ăn đã được lưu
        const menuToSubmit = {
            ...formData,
            meals: {}
        };
        
        savedMeals.forEach(meal => {
            menuToSubmit.meals[meal] = formData.meals[meal];
        });
        
        try {
            const response = selectedMenu 
                ? await axios.put(`http://localhost:3001/menus/${selectedMenu.id}`, menuToSubmit)
                : await axios.post('http://localhost:3001/menus', menuToSubmit);
            
            toast.success(`Thực đơn đã được ${selectedMenu ? 'cập nhật' : 'tạo'} thành công`);
            resetForm();
            fetchMenus();
            setSavedMeals([]);
        } catch (error) {
            console.error('Error submitting menu:', error);
            toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
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

    const saveMeal = () => {
        if (!formData.meals[selectedMeal].name) {
            toast.error('Vui lòng nhập tên món ăn');
            return;
        }
        
        // Kiểm tra xem bữa ăn đã được thêm chưa
        const mealExists = savedMeals.includes(selectedMeal);
        
        if (!mealExists) {
            setSavedMeals([...savedMeals, selectedMeal]);
        } else {
            // Nếu đã tồn tại, chỉ cập nhật thông tin
            toast.success(`Đã cập nhật ${selectedMeal === 'breakfast' ? 'bữa sáng' : 
                                         selectedMeal === 'lunch' ? 'bữa trưa' : 'bữa phụ'}`);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Quản lý thực đơn</h2>
                
                {/* Phần chọn ngày để xem thực đơn */}
                <div className="mb-6 p-6 bg-white rounded-lg shadow border-l-4 border-blue-500">
                    <h3 className="text-xl font-semibold mb-4 text-blue-700">Xem thực đơn theo ngày</h3>
                    <div className="flex items-center gap-4">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="border-2 border-blue-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <button 
                            type="button"
                            onClick={() => setSelectedDate('')}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                            Xóa bộ lọc
                        </button>
                        {selectedDate && filteredMenus.length === 0 && (
                            <p className="text-red-600 font-medium ml-2">Không có thực đơn cho ngày này</p>
                        )}
                        {selectedDate && filteredMenus.length > 0 && (
                            <p className="text-green-600 font-medium ml-2">Tìm thấy {filteredMenus.length} thực đơn</p>
                        )}
                    </div>
                </div>

                {/* Hiển thị thực đơn của ngày được chọn */}
                {selectedDate && filteredMenus.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-4 mb-6">
                        <h3 className="text-lg font-semibold mb-4">Thực đơn ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}</h3>
                        {filteredMenus.map(menu => (
                            <div key={menu.id} className="border rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-medium mb-2">Áp dụng cho: {
                                            menu.applyFor.type === 'all_class' ? 'Tất cả lớp' :
                                            menu.applyFor.type === 'class' ? `Lớp ${menu.applyFor.className}` :
                                            `Học sinh ${menu.applyFor.studentId}`
                                        }</h4>
                                        {menu.applyFor.note && (
                                            <p className="text-gray-600">Ghi chú: {menu.applyFor.note}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                        <button
                                            onClick={() => {
                                                setSelectedMenu(menu);
                                                setFormData({
                                                    date: menu.date,
                                                    applyFor: menu.applyFor,
                                                    meals: menu.meals
                                                });
                                                setSavedMeals(Object.keys(menu.meals).filter(key => 
                                                    menu.meals[key] && Object.keys(menu.meals[key]).length > 0
                                                ));
                                            }}
                                            className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded"
                                        >
                                            Sửa
                        </button>
                                        <button
                                            onClick={() => handleDeleteMenu(menu.id)}
                                            className="px-3 py-1 text-red-600 hover:bg-red-50 rounded"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {Object.entries(menu.meals).map(([mealType, mealData]) => (
                                        mealData && Object.keys(mealData).length > 0 && (
                                            <div key={mealType} className="border rounded p-3">
                                                <h5 className="font-medium mb-2">
                                                    {mealType === 'breakfast' ? 'Bữa sáng' :
                                                     mealType === 'lunch' ? 'Bữa trưa' : 'Bữa phụ'}
                                                </h5>
                                                <p><strong>Món:</strong> {mealData.name}</p>
                                                {mealData.cookingMethods?.length > 0 && (
                                                    <p><strong>Cách chế biến:</strong> {
                                                        mealData.cookingMethods.map(method => (
                                                            method === 'xao' ? 'Xào' :
                                                            method === 'luoc' ? 'Luộc' :
                                                            method === 'hap' ? 'Hấp' :
                                                            method === 'nuong' ? 'Nướng' :
                                                            method === 'chien' ? 'Chiên' :
                                                            method === 'kho' ? 'Kho' :
                                                            method === 'ham' ? 'Hầm' :
                                                            method === 'soup' ? 'Súp' :
                                                            method === 'nuoc' ? 'Món nước' :
                                                            method === 'rang' ? 'Rang' :
                                                            method === 'muoi' ? 'Muối' :
                                                            method === 'uop' ? 'Ướp' :
                                                            method === 'ap_chao' ? 'Áp chảo' : method
                                                        )).join(', ')
                                                    }</p>
                                                )}
                                                {mealData.ingredients?.length > 0 && (
                                                    <p><strong>Nguyên liệu:</strong> {
                                                        mealData.ingredients.map(ing => 
                                                            `${ing.name} (${ing.amount}${ing.unit})`
                                                        ).join(', ')
                                                    }</p>
                                                )}
                                                {mealData.ageGroups?.length > 0 && (
                                                    <p><strong>Độ tuổi:</strong> {
                                                        mealData.ageGroups.map(age => `${age} tuổi`).join(', ')
                                                    }</p>
                    )}
                </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Form thêm/sửa thực đơn */}
                <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-lg font-semibold mb-4">
                        {selectedMenu ? 'Sửa thực đơn' : 'Thêm thực đơn mới'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
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

                        <div className="space-y-4 border-b pb-6 mb-6">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-lg">Thông tin bữa ăn</h3>
                                <select
                                    value={selectedMeal}
                                    onChange={(e) => setSelectedMeal(e.target.value)}
                                    className="border rounded px-3 py-2"
                                >
                                    <option value="breakfast">Bữa sáng</option>
                                    <option value="lunch">Bữa trưa</option>
                                    <option value="snack">Bữa phụ</option>
                                </select>
                            </div>
                            
                            {/* Hiển thị danh sách bữa ăn đã lưu */}
                            {savedMeals.length > 0 && (
                                <div className="mb-4">
                                    <label className="block mb-2 font-medium">Bữa ăn đã thêm:</label>
                                    <div className="flex flex-wrap gap-2">
                                        {savedMeals.map(meal => (
                                            <div 
                                                key={meal} 
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                    meal === selectedMeal 
                                                        ? 'bg-blue-600 text-white' 
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}
                                                onClick={() => setSelectedMeal(meal)}
                                                style={{cursor: 'pointer'}}
                                            >
                            {meal === 'breakfast' ? 'Bữa sáng' :
                                                 meal === 'lunch' ? 'Bữa trưa' : 'Bữa phụ'}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        <div>
                            <label className="block mb-2">Tên món</label>
                            <input
                                type="text"
                                    value={formData.meals[selectedMeal].name}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    meals: {
                                        ...formData.meals,
                                            [selectedMeal]: { ...formData.meals[selectedMeal], name: e.target.value }
                                    }
                                })}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2">Cách chế biến</label>
                                <select
                                    value={formData.meals[selectedMeal].cookingMethods?.[0] || ''}
                                            onChange={(e) => {
                                        const newMethod = e.target.value;
                                                setFormData({
                                                    ...formData,
                                                    meals: {
                                                        ...formData.meals,
                                                [selectedMeal]: { 
                                                    ...formData.meals[selectedMeal], 
                                                    cookingMethods: newMethod ? [newMethod] : [] 
                                                }
                                                    }
                                                });
                                            }}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="">-- Chọn cách chế biến --</option>
                                    <option value="xao">Xào</option>
                                    <option value="luoc">Luộc</option>
                                    <option value="hap">Hấp</option>
                                    <option value="chien">Chiên</option>
                                    <option value="nuong">Nướng</option>
                                    <option value="kho">Kho</option>
                                    <option value="ham">Hầm</option>
                                    <option value="soup">Súp</option>
                                    <option value="nuoc">Món nước</option>
                                    <option value="rang">Rang</option>
                                    <option value="muoi">Muối</option>
                                    <option value="uop">Ướp</option>
                                    <option value="ap_chao">Áp chảo</option>
                                </select>
                        </div>

                        <div className="space-y-4">
                            <label className="block mb-2">Nguyên liệu</label>
                                {formData.meals[selectedMeal].ingredients.map((ingredient, index) => (
                                <div key={index} className="flex items-center space-x-4">
                                    <input
                                        type="text"
                                        placeholder="Tên nguyên liệu"
                                        value={ingredient.name}
                                            onChange={(e) => updateIngredient(selectedMeal, index, 'name', e.target.value)}
                                        className="flex-1 border rounded px-3 py-2"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Số lượng"
                                        value={ingredient.amount}
                                            onChange={(e) => updateIngredient(selectedMeal, index, 'amount', e.target.value)}
                                        className="w-24 border rounded px-3 py-2"
                                    />
                                    <select
                                        value={ingredient.unit}
                                            onChange={(e) => updateIngredient(selectedMeal, index, 'unit', e.target.value)}
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
                                            onClick={() => removeIngredient(selectedMeal, index)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                    onClick={() => addIngredient(selectedMeal)}
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
                                            value={formData.meals[selectedMeal].calories}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            meals: {
                                                ...formData.meals,
                                                    [selectedMeal]: { ...formData.meals[selectedMeal], calories: e.target.value }
                                            }
                                        })}
                                        className="w-full border rounded px-3 py-2"
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
                                            value={formData.meals[selectedMeal].protein}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            meals: {
                                                ...formData.meals,
                                                    [selectedMeal]: { ...formData.meals[selectedMeal], protein: e.target.value }
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
                                    <label className="block mb-2">Tinh bột (g)</label>
                                    <select
                                            value={formData.meals[selectedMeal].carbs}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            meals: {
                                                ...formData.meals,
                                                    [selectedMeal]: { ...formData.meals[selectedMeal], carbs: e.target.value }
                                            }
                                        })}
                                        className="w-full border rounded px-3 py-2"
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
                                            value={formData.meals[selectedMeal].fat}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            meals: {
                                                ...formData.meals,
                                                    [selectedMeal]: { ...formData.meals[selectedMeal], fat: e.target.value }
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
                                    <label className="block mb-2">Chất xơ (g)</label>
                                    <select
                                            value={formData.meals[selectedMeal].fiber}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            meals: {
                                                ...formData.meals,
                                                    [selectedMeal]: { ...formData.meals[selectedMeal], fiber: e.target.value }
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
                                            value={formData.meals[selectedMeal].sugar}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            meals: {
                                                ...formData.meals,
                                                    [selectedMeal]: { ...formData.meals[selectedMeal], sugar: e.target.value }
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
                                            value={formData.meals[selectedMeal].calcium}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            meals: {
                                                ...formData.meals,
                                                    [selectedMeal]: { ...formData.meals[selectedMeal], calcium: e.target.value }
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
                                            value={formData.meals[selectedMeal].iron}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            meals: {
                                                ...formData.meals,
                                                    [selectedMeal]: { ...formData.meals[selectedMeal], iron: e.target.value }
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
                                            value={formData.meals[selectedMeal].vitaminA}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            meals: {
                                                ...formData.meals,
                                                    [selectedMeal]: { ...formData.meals[selectedMeal], vitaminA: e.target.value }
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
                                            value={formData.meals[selectedMeal].vitaminC}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            meals: {
                                                ...formData.meals,
                                                    [selectedMeal]: { ...formData.meals[selectedMeal], vitaminC: e.target.value }
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
                                            value={formData.meals[selectedMeal].sodium}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            meals: {
                                                ...formData.meals,
                                                    [selectedMeal]: { ...formData.meals[selectedMeal], sodium: e.target.value }
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
                                                checked={formData.meals[selectedMeal].ageGroups.includes(age)}
                                            onChange={(e) => {
                                                const newAgeGroups = e.target.checked
                                                        ? [...formData.meals[selectedMeal].ageGroups, age]
                                                        : formData.meals[selectedMeal].ageGroups.filter(g => g !== age);
                                                setFormData({
                                                    ...formData,
                                                    meals: {
                                                        ...formData.meals,
                                                            [selectedMeal]: { ...formData.meals[selectedMeal], ageGroups: newAgeGroups }
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

                        <div className="mt-4">
                    <button
                        type="button"
                                onClick={saveMeal}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                {savedMeals.includes(selectedMeal) ? 'Cập nhật bữa ăn' : 'Lưu bữa ăn này'}
                    </button>
                </div>

                        <div className="flex justify-end space-x-4">
                                    <button
                                type="button"
                                        onClick={() => {
                                    setSelectedMenu(null);
                                    resetForm();
                                    setSavedMeals([]);
                                }}
                                className="px-4 py-2 border rounded"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                {selectedMenu ? 'Cập nhật thực đơn' : 'Tạo thực đơn'}
                            </button>
                        </div>
                    </form>
                    </div>
                </div>
        </div>
    );
}

export default MenuManagement; 