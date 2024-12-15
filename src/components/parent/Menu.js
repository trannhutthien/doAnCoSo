import React, { useState } from 'react';

function Menu() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewType, setViewType] = useState('day'); // 'day' hoặc 'week'

    const menuData = {
        breakfast: {
            name: 'Phở gà',
            calories: 450,
            protein: '20g',
            carbs: '60g',
            fat: '15g',
            fiber: '3g'
        },
        lunch: {
            name: 'Cơm gà rau củ',
            calories: 550,
            protein: '25g',
            carbs: '70g',
            fat: '18g',
            fiber: '5g'
        },
        snack: {
            name: 'Sữa chua hoa quả',
            calories: 200,
            protein: '5g',
            carbs: '25g',
            fat: '8g',
            fiber: '2g'
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Thực đơn</h2>
                <div className="space-x-4">
                    <select
                        value={viewType}
                        onChange={(e) => setViewType(e.target.value)}
                        className="border rounded px-3 py-1"
                    >
                        <option value="day">Theo ngày</option>
                        <option value="week">Theo tuần</option>
                    </select>
                    <input
                        type="date"
                        value={selectedDate.toISOString().split('T')[0]}
                        onChange={(e) => setSelectedDate(new Date(e.target.value))}
                        className="border rounded px-3 py-1"
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {Object.entries(menuData).map(([meal, data]) => (
                    <div key={meal} className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-xl font-semibold capitalize mb-4">{meal}</h3>
                        <div className="space-y-2">
                            <p className="text-lg font-medium">{data.name}</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>Calories: {data.calories}</div>
                                <div>Protein: {data.protein}</div>
                                <div>Carbs: {data.carbs}</div>
                                <div>Fat: {data.fat}</div>
                                <div>Chất xơ: {data.fiber}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Menu; 