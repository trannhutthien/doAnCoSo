import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';

// Helper function để lấy tên phương pháp chế biến (Vẫn giữ lại phòng khi cần)
const getCookingMethodName = (methodCode) => {
    const methods = {
        xao: 'Xào', luoc: 'Luộc', hap: 'Hấp', nuong: 'Nướng', chien: 'Chiên', 
        kho: 'Kho', ham: 'Hầm', soup: 'Súp', nuoc: 'Món nước', rang: 'Rang', 
        muoi: 'Muối', uop: 'Ướp', ap_chao: 'Áp chảo'
    };
    return methods[methodCode] || methodCode;
};

// Helper function để lấy tên bữa ăn
const getMealName = (mealType) => {
    switch (mealType) {
        case 'breakfast': return 'Bữa sáng';
        case 'lunch': return 'Bữa trưa';
        case 'snack': return 'Bữa phụ';
        default: return mealType;
    }
};

// Helper function để định dạng ngày
const formatDate = (date) => {
    if (!date) return '';
    try {
        const dateString = typeof date === 'string' ? date : date.toISOString().split('T')[0];
        return new Date(dateString).toLocaleDateString('vi-VN');
    } catch (error) {
        console.error("Error formatting date:", error, "Input date:", date);
        return '';
    }
}

// Helper function để lấy danh sách dinh dưỡng (Giữ lại cho export)
const getNutrientList = (mealData) => {
    if (!mealData) return [];
    return [
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
    ].filter(n => n.value !== undefined && n.value !== null && n.value !== '');
};


function TeacherMenu() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [menuData, setMenuData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const initialEvaluationState = {
        mealType: '',
        ratings: { taste: 3, nutrition: 3, presentation: 3, temperature: 3, portion: 3 },
        ageGroupSuitability: { '2-3': true, '3-4': true, '4-5': true, '5-6': true },
        comments: '',
        suggestions: ''
    };
    const [evaluation, setEvaluation] = useState(initialEvaluationState);

    useEffect(() => {
        if (menuData && menuData.meals) {
            const firstMeal = Object.keys(menuData.meals).find(key => menuData.meals[key] && Object.keys(menuData.meals[key]).length > 0);
            if (firstMeal && !evaluation.mealType) {
                setEvaluation(prev => ({ ...prev, mealType: firstMeal }));
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menuData]);

    useEffect(() => {
        fetchMenuData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate]);

    const fetchMenuData = async () => {
        if (!selectedDate) {
            setMenuData(null);
            setError(null);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            setMenuData(null);
            const response = await axios.get(`http://localhost:3001/menus?date=${selectedDate}`);
            if (response.data && response.data.length > 0) {
                setMenuData(response.data[0]);
                const firstMeal = Object.keys(response.data[0].meals).find(key => response.data[0].meals[key] && Object.keys(response.data[0].meals[key]).length > 0);
                setEvaluation({ ...initialEvaluationState, mealType: firstMeal || '' });
            } else {
                setMenuData(null);
                // setError('Không có thực đơn cho ngày này.'); // Không báo lỗi khi không có data, chỉ hiển thị thông báo
            }
        } catch (error) {
            console.error('Error fetching menu data:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Lỗi không xác định';
            setError(`Lỗi khi tải thực đơn: ${errorMsg}`);
            setMenuData(null);
            toast.error(`Lỗi khi tải thực đơn: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    const handleEvaluationSubmit = async (e) => {
        e.preventDefault();
        if (!menuData || !menuData.id) {
            toast.error("Không tìm thấy thông tin thực đơn để đánh giá.");
            return;
        }
        if (!evaluation.mealType) {
             toast.error("Vui lòng chọn bữa ăn để đánh giá.");
             return;
        }
        setLoading(true); // Bắt đầu loading khi gửi
        try {
            const response = await axios.post('http://localhost:3001/menu_evaluations', {
                menuId: menuData.id,
                teacherId: 'GV001', // TODO: Lấy teacherId từ context hoặc state
                date: selectedDate,
                ...evaluation
            });
            if (response.status === 201 || response.status === 200) {
                toast.success('Đánh giá thực đơn đã được gửi thành công!');
                setEvaluation(initialEvaluationState); // Reset form
            } else {
                 toast.error(`Gửi đánh giá thất bại: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error submitting evaluation:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Lỗi không xác định';
            toast.error(`Lỗi khi gửi đánh giá: ${errorMsg}`);
        } finally {
            setLoading(false); // Kết thúc loading
        }
    };

    const exportToWord = (menu) => {
        if (!menu) {
            toast.error("Không có dữ liệu thực đơn để xuất.");
            return;
        }
        try {
            let htmlContent = `
                <html><head><meta charset="UTF-8"><style>
                body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
                h1, h2 { color: #2E7D32; text-align: center; }
                h3 { color: #4CAF50; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-top: 20px; }
                .header-info { text-align: center; margin-bottom: 20px; }
                .section { margin-bottom: 20px; padding: 15px; border: 1px solid #eee; border-radius: 5px; background-color: #f9f9f9; }
                p { margin: 5px 0; }
                strong { font-weight: bold; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #E8F5E9; }
                .note { font-style: italic; color: #555; }
                .ingredient { margin-left: 20px; }
                </style></head><body>
                <h1>THỰC ĐƠN NGÀY ${formatDate(menu.date)}</h1>
            `;
            if (menu.applyFor) {
                htmlContent += `<div class='header-info'><p><strong>${ 
                    menu.applyFor.type === 'all_class' ? 'Áp dụng cho: Tất cả lớp' :
                    menu.applyFor.type === 'specific_class' ? `Áp dụng cho: Lớp ${menu.applyFor.className}` :
                    menu.applyFor.type === 'specific_student' ? `Áp dụng cho: Học sinh ${menu.applyFor.studentId}` :
                    menu.applyFor.type === 'special_diet' ? 'Áp dụng cho: Chế độ ăn đặc biệt' : 'Áp dụng cho: Sự kiện đặc biệt'
                }</strong></p>${menu.applyFor.note ? `<p class='note'>Ghi chú: ${menu.applyFor.note}</p>` : ''}</div>`;
            }
            Object.entries(menu.meals).forEach(([mealType, mealData]) => {
                if (!mealData || Object.keys(mealData).length === 0) return;
                const mealTitle = getMealName(mealType).toUpperCase();
                htmlContent += `<div class='section'><h2>${mealTitle}</h2><p><strong>Món:</strong> ${mealData.name || ''}</p>`;
                // Giữ cách chế biến và độ tuổi trong file word nếu có
                if (mealData.cookingMethods?.length > 0) {
                    const methodNames = mealData.cookingMethods.map(getCookingMethodName).join(', ');
                    htmlContent += `<p><strong>Cách chế biến:</strong> ${methodNames}</p>`;
                }
                if (mealData.ageGroups?.length > 0) {
                    const ageText = mealData.ageGroups.map(age => `${age} tuổi`).join(', ');
                    htmlContent += `<p><strong>Độ tuổi phù hợp:</strong> ${ageText}</p>`;
                }
                if (mealData.ingredients?.length > 0) {
                    htmlContent += `<h3>Nguyên liệu:</h3>`;
                    mealData.ingredients.forEach(ing => { htmlContent += `<p class='ingredient'>- ${ing.name}: ${ing.quantity}${ing.unit}</p>`; });
                }
                const nutrientList = getNutrientList(mealData);
                if (nutrientList.length > 0) {
                    htmlContent += `<h3>Thông tin dinh dưỡng:</h3><table><tr><th>Thành phần</th><th>Giá trị</th></tr>`;
                    nutrientList.forEach(nutrient => { htmlContent += `<tr><td>${nutrient.label}</td><td>${nutrient.value} ${nutrient.unit}</td></tr>`; });
                    htmlContent += `</table>`;
                }
                htmlContent += `</div>`;
            });
            htmlContent += `</body></html>`;
            const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
            saveAs(blob, `Thuc_don_ngay_${menu.date.replace(/-/g, '_')}.doc`);
            toast.success("Đã xuất thực đơn thành công!");
        } catch (error) {
            console.error("Lỗi khi xuất file Word:", error);
            toast.error("Có lỗi xảy ra khi xuất thực đơn.");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Phần chọn ngày */}
            <div className="p-6 bg-white rounded-lg shadow border-l-4 border-blue-500">
                 <h2 className="text-2xl font-bold mb-4 text-blue-700">Xem thực đơn và Đánh giá</h2>
                 <div className="flex items-center gap-4 flex-wrap">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="border-2 border-blue-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                     <button
                         type="button"
                         onClick={() => setSelectedDate('')}
                         className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                         aria-label="Bỏ chọn ngày"
                     >
                         Bỏ chọn ngày
                     </button>
                 </div>
             </div>

            {/* Phần hiển thị trạng thái */}
            {loading && (
                <div className="text-center py-10"><p className="text-lg text-gray-600 animate-pulse">Đang tải thực đơn...</p></div>
            )}
            {!loading && error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded text-center shadow">
                    <p className="font-medium">Lỗi!</p><p>{error}</p>
                </div>
            )}
            {/* Thay đổi: Hiển thị thông báo khi không có menuData thay vì báo lỗi */}
            {!loading && !error && !menuData && selectedDate && (
                 <div className="text-center py-10 bg-gray-50 rounded-lg shadow-sm">
                     <p className="text-lg text-gray-500">Không có thực đơn nào được tìm thấy cho ngày {formatDate(selectedDate)}.</p>
                 </div>
            )}
             {!loading && !error && !selectedDate && (
                 <div className="text-center py-10 bg-blue-50 rounded-lg shadow-sm border border-blue-100">
                     <p className="text-lg text-blue-700">Vui lòng chọn một ngày để xem thực đơn.</p>
                 </div>
             )}

            {/* Hiển thị chi tiết thực đơn */}
            {menuData && menuData.meals && (
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex justify-between items-center border-b-2 border-blue-100 pb-3 mb-6">
                        <h3 className="text-2xl font-semibold text-blue-700">Thực đơn ngày {formatDate(menuData.date)}</h3>
                        <button
                            onClick={() => exportToWord(menuData)}
                            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!menuData || loading}
                            aria-label="Xuất thực đơn ra file Word"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Xuất Word
                        </button>
                    </div>

                    {/* Thông tin áp dụng */}
                    {menuData.applyFor && (
                        <div className="mb-6 p-4 bg-indigo-50 rounded-md border border-indigo-100 shadow-sm">
                            <h4 className="font-semibold text-md text-indigo-800 mb-2">Áp dụng cho: {
                                menuData.applyFor.type === 'all_class' ? 'Tất cả lớp' :
                                menuData.applyFor.type === 'specific_class' ? `Lớp ${menuData.applyFor.className}` :
                                menuData.applyFor.type === 'specific_student' ? `Học sinh ${menuData.applyFor.studentId}` :
                                menuData.applyFor.type === 'special_diet' ? 'Chế độ ăn đặc biệt' : 'Sự kiện đặc biệt'
                            }</h4>
                            {menuData.applyFor.note && (<p className="text-indigo-700"><span className="font-medium">Ghi chú:</span> {menuData.applyFor.note}</p>)}
                        </div>
                    )}

                    {/* Danh sách bữa ăn */}
                    <div className="grid grid-cols-1 gap-8">
                        {Object.entries(menuData.meals).map(([mealType, mealData]) => (
                            mealData && Object.keys(mealData).length > 0 && (
                                <div key={mealType} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white">
                                    {/* Header bữa ăn */}
                                    <div className={`px-6 py-4 border-b ${
                                        mealType === 'breakfast' ? 'bg-amber-100 border-amber-200' :
                                        mealType === 'lunch' ? 'bg-blue-100 border-blue-200' :
                                        'bg-teal-100 border-teal-200'
                                    }`}>
                                        <h5 className={`font-semibold text-xl ${
                                            mealType === 'breakfast' ? 'text-amber-800' :
                                            mealType === 'lunch' ? 'text-blue-800' :
                                            'text-teal-800'
                                        }`}>{getMealName(mealType)}</h5>
                                    </div>

                                    {/* Nội dung chi tiết bữa ăn */}
                                    <div className="p-6">
                                        {/* Tên món và mô tả */}
                                        <div className="mb-6">
                                            <h6 className="font-medium text-2xl text-gray-800 mb-3">{mealData.name || 'Chưa có tên món'}</h6>
                                            {mealData.description && (
                                                <p className="text-gray-600 italic">{mealData.description}</p>
                                            )}
                                        </div>

                                        {/* Thông tin chung */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            {/* Cột trái */}
                                            <div className="space-y-4">
                                                {/* Cách chế biến */}
                                                {mealData.cookingMethods?.length > 0 && (
                                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                                        <h6 className="font-medium text-blue-800 mb-2">Cách chế biến:</h6>
                                                        <div className="flex flex-wrap gap-2">
                                                            {mealData.cookingMethods.map((method, idx) => (
                                                                <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                                                                    {getCookingMethodName(method)}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Độ tuổi phù hợp */}
                                                {mealData.ageGroups?.length > 0 && (
                                                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                                        <h6 className="font-medium text-green-800 mb-2">Phù hợp độ tuổi:</h6>
                                                        <div className="flex flex-wrap gap-2">
                                                            {mealData.ageGroups.map((age, idx) => (
                                                                <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                                                                    {age} tuổi
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Cột phải - Thông tin dinh dưỡng cơ bản */}
                                            <div className="grid grid-cols-2 gap-4">
                                                {mealData.calories && (
                                                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                                                        <p className="text-orange-600 text-sm font-medium mb-1">Năng lượng</p>
                                                        <p className="text-2xl font-bold text-orange-700">{mealData.calories}<span className="text-sm ml-1">kcal</span></p>
                                                    </div>
                                                )}
                                                {mealData.protein && (
                                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                                        <p className="text-blue-600 text-sm font-medium mb-1">Chất đạm</p>
                                                        <p className="text-2xl font-bold text-blue-700">{mealData.protein}<span className="text-sm ml-1">g</span></p>
                                                    </div>
                                                )}
                                                {mealData.carbs && (
                                                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                                        <p className="text-yellow-600 text-sm font-medium mb-1">Tinh bột</p>
                                                        <p className="text-2xl font-bold text-yellow-700">{mealData.carbs}<span className="text-sm ml-1">g</span></p>
                                                    </div>
                                                )}
                                                {mealData.fat && (
                                                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                                        <p className="text-purple-600 text-sm font-medium mb-1">Chất béo</p>
                                                        <p className="text-2xl font-bold text-purple-700">{mealData.fat}<span className="text-sm ml-1">g</span></p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Nguyên liệu */}
                                        {mealData.ingredients?.length > 0 && (
                                            <div className="mb-6">
                                                <h6 className="font-medium text-lg text-gray-800 mb-4">Nguyên liệu:</h6>
                                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {mealData.ingredients.map((ing, idx) => (
                                                            <div key={idx} className="flex items-center space-x-3 text-gray-700">
                                                                <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                                                                <span className="flex-grow">{ing.name}</span>
                                                                <span className="font-medium text-gray-900">{ing.quantity}{ing.unit}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Thông tin dinh dưỡng chi tiết */}
                                        {(mealData.fiber || mealData.sugar || mealData.calcium || mealData.iron || mealData.vitaminA || mealData.vitaminC || mealData.sodium) && (
                                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                                <h6 className="font-medium text-lg text-gray-800 mb-4">Thông tin dinh dưỡng chi tiết:</h6>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                                    {mealData.fiber && (
                                                        <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                                            <p className="text-gray-500 text-sm">Chất xơ</p>
                                                            <p className="text-lg font-semibold text-gray-900">{mealData.fiber} g</p>
                                                        </div>
                                                    )}
                                                    {mealData.sugar && (
                                                        <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                                            <p className="text-gray-500 text-sm">Đường</p>
                                                            <p className="text-lg font-semibold text-gray-900">{mealData.sugar} g</p>
                                                        </div>
                                                    )}
                                                    {mealData.calcium && (
                                                        <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                                            <p className="text-gray-500 text-sm">Canxi</p>
                                                            <p className="text-lg font-semibold text-gray-900">{mealData.calcium} mg</p>
                                                        </div>
                                                    )}
                                                    {mealData.iron && (
                                                        <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                                            <p className="text-gray-500 text-sm">Sắt</p>
                                                            <p className="text-lg font-semibold text-gray-900">{mealData.iron} mg</p>
                                                        </div>
                                                    )}
                                                    {mealData.vitaminA && (
                                                        <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                                            <p className="text-gray-500 text-sm">Vitamin A</p>
                                                            <p className="text-lg font-semibold text-gray-900">{mealData.vitaminA} mcg</p>
                                                        </div>
                                                    )}
                                                    {mealData.vitaminC && (
                                                        <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                                            <p className="text-gray-500 text-sm">Vitamin C</p>
                                                            <p className="text-lg font-semibold text-gray-900">{mealData.vitaminC} mg</p>
                                                        </div>
                                                    )}
                                                    {mealData.sodium && (
                                                        <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                                            <p className="text-gray-500 text-sm">Natri</p>
                                                            <p className="text-lg font-semibold text-gray-900">{mealData.sodium} mg</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        ))}
                        {Object.values(menuData.meals || {}).every(meal => !meal || Object.keys(meal).length === 0) && (
                            <p className="text-gray-500 text-center py-4">Thực đơn này chưa có thông tin chi tiết cho các bữa ăn.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Phần đánh giá (Giữ nguyên như phiên bản trước đó) */}
            {menuData && Object.values(menuData.meals || {}).some(meal => meal && Object.keys(meal).length > 0) && (
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mt-8">
                    <h3 className="text-2xl font-semibold mb-6 border-b-2 border-gray-100 pb-3 text-gray-700">Đánh giá thực đơn</h3>
                    <form onSubmit={handleEvaluationSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="mealTypeEval" className="block mb-2 font-medium text-gray-700">Chọn bữa ăn để đánh giá *</label>
                            <select id="mealTypeEval" value={evaluation.mealType} onChange={(e) => setEvaluation({ ...evaluation, mealType: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm" required>
                                <option value="" disabled>-- Chọn bữa ăn --</option>
                                {Object.keys(menuData.meals || {}).map(mealKey => (menuData.meals[mealKey] && Object.keys(menuData.meals[mealKey]).length > 0 && (<option key={mealKey} value={mealKey}>{getMealName(mealKey)}</option>)))}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-3 font-medium text-gray-700">Đánh giá chi tiết (1 = Kém, 5 = Tốt)</label>
                            <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                                {Object.entries(evaluation.ratings).map(([criterion, rating]) => (<div key={criterion} className="flex items-center justify-between"><label htmlFor={`rating-${criterion}`} className="capitalize text-gray-600 w-1/3 sm:w-1/4">{criterion}</label><input id={`rating-${criterion}`} type="range" min="1" max="5" step="1" value={rating} onChange={(e) => setEvaluation({...evaluation, ratings: {...evaluation.ratings, [criterion]: parseInt(e.target.value)}})} className="w-1/2 mx-4 accent-blue-600 cursor-pointer"/><span className="font-medium text-blue-600 w-10 text-center bg-blue-100 rounded px-1 py-0.5 text-sm">{rating}/5</span></div>))}
                            </div>
                        </div>
                        <div>
                            <label className="block mb-2 font-medium text-gray-700">Mức độ phù hợp với độ tuổi</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                                {Object.entries(evaluation.ageGroupSuitability).map(([age, suitable]) => (<label key={age} className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-100 transition-colors"><input type="checkbox" checked={suitable} onChange={(e) => setEvaluation({...evaluation, ageGroupSuitability: {...evaluation.ageGroupSuitability, [age]: e.target.checked}})} className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 shadow-sm"/><span className="text-gray-700">{age} tuổi</span></label>))}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="comments" className="block mb-2 font-medium text-gray-700">Nhận xét chung</label>
                            <textarea id="comments" value={evaluation.comments} onChange={(e) => setEvaluation({ ...evaluation, comments: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" placeholder="Nhận xét của bạn về thực đơn (ví dụ: trẻ ăn ngon miệng, món ăn hấp dẫn,...)" rows="4"/>
                        </div>
                        <div>
                            <label htmlFor="suggestions" className="block mb-2 font-medium text-gray-700">Đề xuất điều chỉnh (nếu có)</label>
                            <textarea id="suggestions" value={evaluation.suggestions} onChange={(e) => setEvaluation({ ...evaluation, suggestions: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" placeholder="Đề xuất của bạn để cải thiện thực đơn (ví dụ: thay đổi nguyên liệu, cách chế biến,...)" rows="4"/>
                        </div>
                        <div className="text-right pt-4 border-t border-gray-100">
                             <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>{loading ? 'Đang gửi...' : 'Gửi đánh giá'}</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default TeacherMenu; 