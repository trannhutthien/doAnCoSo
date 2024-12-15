import React, { useState, useEffect } from 'react';

function Grades() {
    const [grades, setGrades] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const response = await fetch('http://localhost:3001/grades?studentId=HS001');
                const data = await response.json();
                setGrades(data[0]);
            } catch (error) {
                console.error('Error fetching grades:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGrades();
    }, []);

    if (loading) return <div>Đang tải...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Kết quả học tập</h2>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4">Đánh giá tháng {grades?.month}/{grades?.year}</h3>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span>Thể chất:</span>
                                <span className="font-medium">{grades?.categories.theChat}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Nhận thức:</span>
                                <span className="font-medium">{grades?.categories.nhanThuc}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Ngôn ngữ:</span>
                                <span className="font-medium">{grades?.categories.ngonNgu}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tình cảm:</span>
                                <span className="font-medium">{grades?.categories.tinhCam}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Thẩm mỹ:</span>
                                <span className="font-medium">{grades?.categories.thamMy}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Nhận xét của giáo viên</h3>
                    <p className="text-gray-700">{grades?.comments}</p>
                </div>
            </div>
        </div>
    );
}

export default Grades; 