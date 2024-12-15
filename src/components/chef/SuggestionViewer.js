import React, { useState, useEffect } from 'react';

function SuggestionViewer() {
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const fetchSuggestions = async () => {
        try {
            const response = await fetch('http://localhost:3001/menu_suggestions');
            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await fetch(`http://localhost:3001/menu_suggestions/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });
            fetchSuggestions();
        } catch (error) {
            console.error('Error updating suggestion:', error);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Đề xuất thực đơn</h2>

            <div className="bg-white rounded-lg shadow">
                {suggestions.map(suggestion => (
                    <div key={suggestion.id} className="border-b last:border-b-0 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-medium text-lg">{suggestion.dishName}</h3>
                                <p className="text-sm text-gray-600">
                                    Đề xuất bởi: {suggestion.userRole === 'giaovien' ? 'Giáo viên' : 'Phụ huynh'}
                                </p>
                            </div>
                            <div className="space-x-2">
                                {suggestion.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleStatusChange(suggestion.id, 'approved')}
                                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                        >
                                            Chấp nhận
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(suggestion.id, 'rejected')}
                                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                        >
                                            Từ chối
                                        </button>
                                    </>
                                )}
                                {suggestion.status === 'approved' && (
                                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded">
                                        Đã chấp nhận
                                    </span>
                                )}
                                {suggestion.status === 'rejected' && (
                                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded">
                                        Đã từ chối
                                    </span>
                                )}
                            </div>
                        </div>
                        <p className="text-gray-700">{suggestion.reason}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SuggestionViewer; 