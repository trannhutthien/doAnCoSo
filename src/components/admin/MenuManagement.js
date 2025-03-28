import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, BorderStyle, AlignmentType, HeadingLevel, Header } from 'docx';
import { saveAs } from 'file-saver';

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

    const exportToWord = (menu) => {
        try {
            // Tạo HTML content
            let htmlContent = `
                <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                <head>
                    <meta charset='utf-8'>
                    <title>Thực đơn ngày ${menu.date}</title>
                    <style>
                        body { font-family: 'Arial', sans-serif; }
                        h1, h2, h3 { color: #2E74B5; }
                        h1 { font-size: 20pt; text-align: center; margin-bottom: 10px; }
                        h2 { font-size: 16pt; margin-top: 20px; margin-bottom: 5px; }
                        h3 { font-size: 12pt; margin-top: 10px; margin-bottom: 5px; }
                        p { margin: 5px 0; }
                        .apply-info { text-align: center; margin-bottom: 20px; }
                        .note { font-style: italic; margin-bottom: 20px; }
                        .section { margin-bottom: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                        table, th, td { border: 1px solid #ddd; }
                        th, td { padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        .ingredient { margin-left: 20px; }
                    </style>
                </head>
                <body>
                    <h1>THỰC ĐƠN NGÀY ${new Date(menu.date).toLocaleDateString('vi-VN')}</h1>
                    <div class='apply-info'>
                        <p><strong>${
                            menu.applyFor.type === 'all_class' ? 'Áp dụng cho: Tất cả các lớp' :
                            menu.applyFor.type === 'specific_class' ? `Áp dụng cho: Lớp ${menu.applyFor.className}` :
                            menu.applyFor.type === 'specific_student' ? `Áp dụng cho: Học sinh ${menu.applyFor.studentId}` :
                            menu.applyFor.type === 'special_diet' ? 'Áp dụng cho: Chế độ ăn đặc biệt' : 'Áp dụng cho: Sự kiện đặc biệt'
                        }</strong></p>
                        ${menu.applyFor.note ? `<p class='note'>Ghi chú: ${menu.applyFor.note}</p>` : ''}
                    </div>
            `;

            // Duyệt qua các bữa ăn
            Object.entries(menu.meals).forEach(([mealType, mealData]) => {
                if (!mealData || Object.keys(mealData).length === 0) return;

                const mealTitle = mealType === 'breakfast' ? 'BỮA SÁNG' :
                                  mealType === 'lunch' ? 'BỮA TRƯA' : 'BỮA PHỤ';
                
                htmlContent += `
                    <div class='section'>
                        <h2>${mealTitle}</h2>
                        <p><strong>Món:</strong> ${mealData.name || ''}</p>
                `;

                // Cách chế biến
                if (mealData.cookingMethods?.length > 0) {
                    const methodNames = mealData.cookingMethods.map(method => (
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
                    )).join(', ');
                    
                    htmlContent += `<p><strong>Cách chế biến:</strong> ${methodNames}</p>`;
                }

                // Độ tuổi
                if (mealData.ageGroups?.length > 0) {
                    const ageText = mealData.ageGroups.map(age => `${age} tuổi`).join(', ');
                    htmlContent += `<p><strong>Độ tuổi phù hợp:</strong> ${ageText}</p>`;
                }

                // Nguyên liệu
                if (mealData.ingredients?.length > 0) {
                    htmlContent += `<h3>Nguyên liệu:</h3>`;
                    
                    mealData.ingredients.forEach(ing => {
                        htmlContent += `<p class='ingredient'>- ${ing.name}: ${ing.amount} ${ing.unit}</p>`;
                    });
                }

                // Thông tin dinh dưỡng
                const hasNutrients = mealData.calories || mealData.protein || mealData.carbs || 
                                    mealData.fat || mealData.fiber || mealData.calcium || 
                                    mealData.iron || mealData.vitaminA || mealData.vitaminC || 
                                    mealData.sugar || mealData.sodium;
                
                if (hasNutrients) {
                    htmlContent += `<h3>Thông tin dinh dưỡng:</h3>`;
                    htmlContent += `<table>
                        <tr>
                            <th>Thành phần</th>
                            <th>Giá trị</th>
                        </tr>
                    `;
                    
                    [
                        { label: 'Năng lượng', value: mealData.calories, unit: 'kcal' },
                        { label: 'Chất đạm', value: mealData.protein, unit: 'g' },
                        { label: 'Tinh bột', value: mealData.carbs, unit: 'g' },
                        { label: 'Chất béo', value: mealData.fat, unit: 'g' },
                        { label: 'Chất xơ', value: mealData.fiber, unit: 'g' },
                        { label: 'Đường', value: mealData.sugar, unit: 'g' },
                        { label: 'Canxi', value: mealData.calcium, unit: 'mg' },
                        { label: 'Sắt', value: mealData.iron, unit: 'mg' },
                        { label: 'Vitamin A', value: mealData.vitaminA, unit: 'mcg' },
                        { label: 'Vitamin C', value: mealData.vitaminC, unit: 'mg' },
                        { label: 'Natri', value: mealData.sodium, unit: 'mg' }
                    ].forEach(nutrient => {
                        if (nutrient.value) {
                            htmlContent += `
                                <tr>
                                    <td>${nutrient.label}</td>
                                    <td>${nutrient.value} ${nutrient.unit}</td>
                                </tr>
                            `;
                        }
                    });
                    
                    htmlContent += `</table>`;
                }
                
                htmlContent += `</div>`;
            });
            
            htmlContent += `</body></html>`;
            
            // Tạo Blob và tải xuống
            const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
            saveAs(blob, `Thuc_don_ngay_${menu.date.replace(/-/g, '_')}.doc`);
            toast.success("Đã xuất thực đơn thành file Word");
        } catch (error) {
            console.error("Lỗi khi xuất file Word:", error);
            toast.error("Có lỗi khi xuất file Word");
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
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-blue-700 border-b pb-2">Thực đơn ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}</h3>
                            <button
                                onClick={() => {
                                    if (filteredMenus.length > 1) {
                                        toast.info("Có nhiều thực đơn cho ngày này. Mỗi thực đơn sẽ được xuất riêng.");
                                    }
                                    filteredMenus.forEach(menu => exportToWord(menu));
                                }}
                                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Xuất Word
                            </button>
                        </div>
                        {filteredMenus.map(menu => (
                            <div key={menu.id} className="border border-gray-200 rounded-lg p-6 mb-6 hover:border-blue-300 transition-all shadow-sm">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h4 className="font-semibold text-lg mb-2">Áp dụng cho: {
                                            menu.applyFor.type === 'all_class' ? 'Tất cả lớp' :
                                            menu.applyFor.type === 'specific_class' ? `Lớp ${menu.applyFor.className}` :
                                            menu.applyFor.type === 'specific_student' ? `Học sinh ${menu.applyFor.studentId}` :
                                            menu.applyFor.type === 'special_diet' ? 'Chế độ ăn đặc biệt' : 'Sự kiện đặc biệt'
                                        }</h4>
                                        {menu.applyFor.note && (
                                            <p className="text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-100">
                                                <span className="font-medium">Ghi chú:</span> {menu.applyFor.note}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => exportToWord(menu)}
                                            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                                        >
                                            Xuất Word
                                        </button>
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
                                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                        >
                                            Sửa thực đơn
                                        </button>
                                        <button
                                            onClick={() => handleDeleteMenu(menu.id)}
                                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                        >
                                            Xóa thực đơn
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedMenuForApply(menu);
                                                setShowApplyModal(true);
                                            }}
                                            className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                        >
                                            Áp dụng cho ngày khác
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {Object.entries(menu.meals).map(([mealType, mealData]) => (
                                        mealData && Object.keys(mealData).length > 0 && (
                                            <div key={mealType} className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-200 transition-all">
                                                <div className={`px-4 py-3 ${
                                                    mealType === 'breakfast' ? 'bg-amber-50 border-b border-amber-100' : 
                                                    mealType === 'lunch' ? 'bg-blue-50 border-b border-blue-100' : 
                                                    'bg-teal-50 border-b border-teal-100'
                                                }`}>
                                                    <h5 className="font-semibold text-gray-800">
                                                        {mealType === 'breakfast' ? 'Bữa sáng' :
                                                         mealType === 'lunch' ? 'Bữa trưa' : 'Bữa phụ'}
                                                    </h5>
                                                </div>
                                                
                                                <div className="p-4 space-y-4">
                                                    <div className="bg-white border border-gray-100 rounded-md p-3">
                                                        <h6 className="font-medium mb-2 text-lg text-gray-800">{mealData.name}</h6>
                                                        
                                                        {/* Cách chế biến */}
                                                        {mealData.cookingMethods?.length > 0 && (
                                                            <div className="mb-3">
                                                                <span className="text-sm text-gray-500 block mb-1">Cách chế biến:</span>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {mealData.cookingMethods.map(method => {
                                                                        const methodName = 
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
                                                                            method === 'ap_chao' ? 'Áp chảo' : method;
                                                                            
                                                                        return (
                                                                            <span key={method} className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm border border-yellow-100">
                                                                                {methodName}
                                                                            </span>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                        
                                                        {/* Độ tuổi */}
                                                        {mealData.ageGroups?.length > 0 && (
                                                            <div className="mb-3">
                                                                <span className="text-sm text-gray-500 block mb-1">Độ tuổi phù hợp:</span>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {mealData.ageGroups.map(age => (
                                                                        <span key={age} className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-sm border border-purple-100">
                                                                            {age} tuổi
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                        
                                                        {/* Nguyên liệu */}
                                                        {mealData.ingredients?.length > 0 && (
                                                            <div className="mt-4 border-t pt-3 border-gray-100">
                                                                <span className="text-sm text-gray-500 block mb-2">Nguyên liệu:</span>
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    {mealData.ingredients.map((ing, idx) => (
                                                                        <div key={idx} className="flex items-center gap-2 text-sm">
                                                                            <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                                                            <span className="text-gray-800">
                                                                                {ing.name}: <span className="font-medium">{ing.amount} {ing.unit}</span>
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Thông tin dinh dưỡng */}
                                                    <div className="border-t border-gray-100 pt-4">
                                                        <h6 className="text-sm font-medium text-gray-500 mb-3">Thông tin dinh dưỡng</h6>
                                                        
                                                        <div className="grid grid-cols-2 gap-3">
                                                            {mealData.calories && (
                                                                <div className="bg-blue-50 p-2 rounded text-sm">
                                                                    <span className="text-gray-500">Năng lượng:</span>
                                                                    <span className="block font-medium text-blue-700">{mealData.calories} kcal</span>
                                                                </div>
                                                            )}
                                                            
                                                            {mealData.protein && (
                                                                <div className="bg-green-50 p-2 rounded text-sm">
                                                                    <span className="text-gray-500">Chất đạm:</span>
                                                                    <span className="block font-medium text-green-700">{mealData.protein}g</span>
                                                                </div>
                                                            )}
                                                            
                                                            {mealData.carbs && (
                                                                <div className="bg-orange-50 p-2 rounded text-sm">
                                                                    <span className="text-gray-500">Tinh bột:</span>
                                                                    <span className="block font-medium text-orange-700">{mealData.carbs}g</span>
                                                                </div>
                                                            )}
                                                            
                                                            {mealData.fat && (
                                                                <div className="bg-yellow-50 p-2 rounded text-sm">
                                                                    <span className="text-gray-500">Chất béo:</span>
                                                                    <span className="block font-medium text-yellow-700">{mealData.fat}g</span>
                                                                </div>
                                                            )}
                                                            
                                                            {mealData.fiber && (
                                                                <div className="bg-emerald-50 p-2 rounded text-sm">
                                                                    <span className="text-gray-500">Chất xơ:</span>
                                                                    <span className="block font-medium text-emerald-700">{mealData.fiber}g</span>
                                                                </div>
                                                            )}
                                                            
                                                            {mealData.sugar && (
                                                                <div className="bg-pink-50 p-2 rounded text-sm">
                                                                    <span className="text-gray-500">Đường:</span>
                                                                    <span className="block font-medium text-pink-700">{mealData.sugar}g</span>
                                                                </div>
                                                            )}
                                                            
                                                            {mealData.calcium && (
                                                                <div className="bg-indigo-50 p-2 rounded text-sm">
                                                                    <span className="text-gray-500">Canxi:</span>
                                                                    <span className="block font-medium text-indigo-700">{mealData.calcium}mg</span>
                                                                </div>
                                                            )}
                                                            
                                                            {mealData.iron && (
                                                                <div className="bg-red-50 p-2 rounded text-sm">
                                                                    <span className="text-gray-500">Sắt:</span>
                                                                    <span className="block font-medium text-red-700">{mealData.iron}mg</span>
                                                                </div>
                                                            )}
                                                            
                                                            {mealData.vitaminA && (
                                                                <div className="bg-amber-50 p-2 rounded text-sm">
                                                                    <span className="text-gray-500">Vitamin A:</span>
                                                                    <span className="block font-medium text-amber-700">{mealData.vitaminA}mcg</span>
                                                                </div>
                                                            )}
                                                            
                                                            {mealData.vitaminC && (
                                                                <div className="bg-lime-50 p-2 rounded text-sm">
                                                                    <span className="text-gray-500">Vitamin C:</span>
                                                                    <span className="block font-medium text-lime-700">{mealData.vitaminC}mg</span>
                                                                </div>
                                                            )}
                                                            
                                                            {mealData.sodium && (
                                                                <div className="bg-violet-50 p-2 rounded text-sm">
                                                                    <span className="text-gray-500">Natri:</span>
                                                                    <span className="block font-medium text-violet-700">{mealData.sodium}mg</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
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