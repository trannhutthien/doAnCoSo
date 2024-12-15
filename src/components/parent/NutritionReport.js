import React, { useState, useEffect } from 'react';

function NutritionReport() {
    const [nutritionData, setNutritionData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Fetch từ API thực tế
        const fetchNutritionData = async () => {
            try {
                const response = await fetch('http://localhost:3001/nutrition_reports?studentId=HS001');
                const data = await response.json();
                setNutritionData(data[0]);
            } catch (error) {
                console.error('Error fetching nutrition data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNutritionData();
    }, []);

    if (loading) return <div>Đang tải...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Báo cáo dinh dưỡng</h2>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Chỉ số dinh dưỡng</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span>Calories:</span>
                                <span className="font-medium">{nutritionData?.calories} kcal</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Protein:</span>
                                <span className="font-medium">{nutritionData?.protein}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Carbs:</span>
                                <span className="font-medium">{nutritionData?.carbs}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Chất béo:</span>
                                <span className="font-medium">{nutritionData?.fat}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Chất xơ:</span>
                                <span className="font-medium">{nutritionData?.fiber}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-4">Vitamin và khoáng chất</h3>
                        <div className="space-y-3">
                            <div>
                                <span className="font-medium">Vitamin:</span>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {nutritionData?.vitamins.map(vitamin => (
                                        <span key={vitamin} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                            Vitamin {vitamin}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <span className="font-medium">Khoáng chất:</span>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {nutritionData?.minerals.map(mineral => (
                                        <span key={mineral} className="bg-green-100 text-green-800 px-2 py-1 rounded">
                                            {mineral}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NutritionReport; 