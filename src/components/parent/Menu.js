import React, { useState, useEffect } from 'react';
import './Menu.css';

function Menu() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [menuItems, setMenuItems] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3001/menus?date=${selectedDate}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const menuForDate = data.find(menu => menu.date === selectedDate);
                    setMenuItems(menuForDate);
                } else {
                    setMenuItems(null);
                }
            })
            .catch(error => {
                console.error('Error fetching menu:', error);
                setMenuItems(null);
            });
    }, [selectedDate]);

    const getMealName = (mealType) => {
        switch(mealType) {
            case 'breakfast': return 'Bữa sáng';
            case 'lunch': return 'Bữa trưa';
            case 'snack': return 'Bữa phụ';
            default: return mealType;
        }
    };

    const getCookingMethods = (methods) => {
        const methodMap = {
            xao: 'Xào',
            luoc: 'Luộc',
            hap: 'Hấp',
            chien: 'Chiên',
            nuong: 'Nướng',
            kho: 'Kho',
            ham: 'Hầm',
            soup: 'Súp',
            nuoc: 'Món nước',
            rang: 'Rang',
            muoi: 'Muối',
            uop: 'Ướp',
            ap_chao: 'Áp chảo'
        };
        return methods?.map(method => methodMap[method] || method).join(', ');
    };

    return (
        <div className="menu-items">
            <h2>Thực đơn ngày: {new Date(selectedDate).toLocaleDateString('vi-VN')}</h2>
            
            <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mb-6"
            />

            {menuItems ? (
                <div className="space-y-6">
                    {Object.entries(menuItems.meals).map(([mealType, meal]) => (
                        <div key={mealType} className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-semibold mb-4 text-blue-600">
                                {getMealName(mealType)}
                            </h3>
                            
                            {/* Tên món và cách chế biến */}
                            <div className="mb-4">
                                <h4 className="text-lg font-medium text-gray-800">
                                    {meal.name}
                                </h4>
                                {meal.cookingMethods && meal.cookingMethods.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-gray-600">
                                            Cách chế biến: {getCookingMethods(meal.cookingMethods)}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Nguyên liệu */}
                            {meal.ingredients && meal.ingredients.length > 0 && (
                                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                                    <h5 className="font-medium mb-2">Nguyên liệu:</h5>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {meal.ingredients.map((ingredient, idx) => (
                                            <div key={idx} className="text-gray-600">
                                                {ingredient.name}: {ingredient.amount} {ingredient.unit}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Thông tin dinh dưỡng */}
                            <div className="space-y-4">
                                <h5 className="font-medium">Thông tin dinh dưỡng:</h5>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {meal.calories && (
                                        <div className="bg-blue-50 p-3 rounded">
                                            <p className="text-sm text-gray-600">Năng lượng</p>
                                            <p className="font-medium">{meal.calories} kcal</p>
                                        </div>
                                    )}
                                    {meal.protein && (
                                        <div className="bg-blue-50 p-3 rounded">
                                            <p className="text-sm text-gray-600">Chất đạm</p>
                                            <p className="font-medium">{meal.protein}g</p>
                                        </div>
                                    )}
                                    {meal.carbs && (
                                        <div className="bg-blue-50 p-3 rounded">
                                            <p className="text-sm text-gray-600">Tinh bột</p>
                                            <p className="font-medium">{meal.carbs}g</p>
                                        </div>
                                    )}
                                    {meal.fat && (
                                        <div className="bg-blue-50 p-3 rounded">
                                            <p className="text-sm text-gray-600">Chất béo</p>
                                            <p className="font-medium">{meal.fat}g</p>
                                        </div>
                                    )}
                                    {meal.fiber && (
                                        <div className="bg-blue-50 p-3 rounded">
                                            <p className="text-sm text-gray-600">Chất xơ</p>
                                            <p className="font-medium">{meal.fiber}g</p>
                                        </div>
                                    )}
                                    {meal.calcium && (
                                        <div className="bg-blue-50 p-3 rounded">
                                            <p className="text-sm text-gray-600">Canxi</p>
                                            <p className="font-medium">{meal.calcium}mg</p>
                                        </div>
                                    )}
                                    {meal.iron && (
                                        <div className="bg-blue-50 p-3 rounded">
                                            <p className="text-sm text-gray-600">Sắt</p>
                                            <p className="font-medium">{meal.iron}mg</p>
                                        </div>
                                    )}
                                    {meal.vitaminA && (
                                        <div className="bg-blue-50 p-3 rounded">
                                            <p className="text-sm text-gray-600">Vitamin A</p>
                                            <p className="font-medium">{meal.vitaminA}mcg</p>
                                        </div>
                                    )}
                                    {meal.vitaminC && (
                                        <div className="bg-blue-50 p-3 rounded">
                                            <p className="text-sm text-gray-600">Vitamin C</p>
                                            <p className="font-medium">{meal.vitaminC}mg</p>
                                        </div>
                                    )}
                                    {meal.sugar && (
                                        <div className="bg-blue-50 p-3 rounded">
                                            <p className="text-sm text-gray-600">Đường</p>
                                            <p className="font-medium">{meal.sugar}g</p>
                                        </div>
                                    )}
                                    {meal.sodium && (
                                        <div className="bg-blue-50 p-3 rounded">
                                            <p className="text-sm text-gray-600">Natri</p>
                                            <p className="font-medium">{meal.sodium}mg</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Độ tuổi phù hợp */}
                            <div className="mt-4 text-gray-600">
                                <p>Phù hợp độ tuổi: {meal.ageGroups.join(', ')} tuổi</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">Không có thực đơn cho ngày này</p>
                </div>
            )}
        </div>
    );
}

export default Menu; 