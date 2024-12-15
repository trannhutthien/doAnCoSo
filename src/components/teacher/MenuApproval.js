import React, { useState, useEffect } from 'react';

function MenuApproval() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await fetch('http://localhost:3001/menu_requests?status=pending');
            const data = await response.json();
            setRequests(data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    const handleApproval = async (id, status, response) => {
        try {
            await fetch(`http://localhost:3001/menu_requests/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status,
                    teacherResponse: response
                }),
            });
            fetchRequests();
        } catch (error) {
            console.error('Error updating request:', error);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Phê duyệt yêu cầu thay đổi thực đơn của người kháckhác</h2>

            {requests.map(request => (
                <div key={request.id} className="bg-white rounded-lg shadow p-6">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <p className="font-semibold">Học sinh:</p>
                            <p>{request.studentId}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Ngày:</p>
                            <p>{request.date}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Thực đơn hiện tại:</p>
                            <p>{request.currentMenu}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Yêu cầu thay đổi:</p>
                            <p>{request.requestedChange}</p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <p className="font-semibold">Lý do:</p>
                        <p>{request.reason}</p>
                    </div>

                    {request.status === 'pending' && (
                        <div className="flex space-x-4">
                            <button
                                onClick={() => handleApproval(request.id, 'approved', 'Đồng ý thay đổi thực đơn')}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Phê duyệt
                            </button>
                            <button
                                onClick={() => handleApproval(request.id, 'rejected', 'Không thể thay đổi thực đơn')}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Từ chối
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default MenuApproval; 