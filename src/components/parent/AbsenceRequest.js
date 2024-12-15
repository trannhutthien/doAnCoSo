import React, { useState } from 'react';

function AbsenceRequest() {
    const [request, setRequest] = useState({
        startDate: '',
        endDate: '',
        reason: '',
        parentNote: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/absence_requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...request,
                    studentId: 'HS001', // TODO: Lấy từ context hoặc props
                    status: 'pending',
                    teacherResponse: null
                }),
            });

            if (response.ok) {
                alert('Đã gửi đơn xin nghỉ thành công!');
                setRequest({ startDate: '', endDate: '', reason: '', parentNote: '' });
            }
        } catch (error) {
            console.error('Error submitting absence request:', error);
            alert('Có lỗi xảy ra khi gửi đơn xin nghỉ');
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Đơn xin nghỉ</h2>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                <div>
                    <label className="block mb-2">Ngày bắt đầu</label>
                    <input
                        type="date"
                        value={request.startDate}
                        onChange={(e) => setRequest({ ...request, startDate: e.target.value })}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2">Ngày kết thúc</label>
                    <input
                        type="date"
                        value={request.endDate}
                        onChange={(e) => setRequest({ ...request, endDate: e.target.value })}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2">Lý do nghỉ</label>
                    <select
                        value={request.reason}
                        onChange={(e) => setRequest({ ...request, reason: e.target.value })}
                        className="w-full border rounded px-3 py-2"
                        required
                    >
                        <option value="">Chọn lý do</option>
                        <option value="Bệnh">Bệnh</option>
                        <option value="Về quê">Về quê</option>
                        <option value="Việc gia đình">Việc gia đình</option>
                        <option value="Khác">Khác</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-2">Ghi chú thêm</label>
                    <textarea
                        value={request.parentNote}
                        onChange={(e) => setRequest({ ...request, parentNote: e.target.value })}
                        className="w-full border rounded px-3 py-2 h-32"
                        placeholder="Nhập ghi chú thêm nếu cần..."
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    Gửi đơn xin nghỉ
                </button>
            </form>
        </div>
    );
}

export default AbsenceRequest; 