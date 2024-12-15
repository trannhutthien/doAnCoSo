import React, { useState } from 'react';

function Feedback() {
    const [feedback, setFeedback] = useState({
        menuDate: '',
        content: '',
        allergies: '',
        preferences: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Gửi phản hồi đến API
        console.log('Feedback submitted:', feedback);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Gửi phản hồi</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block mb-2">Ngày thực đơn</label>
                    <input
                        type="date"
                        value={feedback.menuDate}
                        onChange={(e) => setFeedback({ ...feedback, menuDate: e.target.value })}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-2">Nội dung phản hồi</label>
                    <textarea
                        value={feedback.content}
                        onChange={(e) => setFeedback({ ...feedback, content: e.target.value })}
                        className="w-full border rounded px-3 py-2 h-32"
                        placeholder="Nhập phản hồi của bạn về thực đơn..."
                    />
                </div>

                <div>
                    <label className="block mb-2">Dị ứng thực phẩm</label>
                    <textarea
                        value={feedback.allergies}
                        onChange={(e) => setFeedback({ ...feedback, allergies: e.target.value })}
                        className="w-full border rounded px-3 py-2 h-24"
                        placeholder="Liệt kê các thực phẩm gây dị ứng (nếu có)..."
                    />
                </div>

                <div>
                    <label className="block mb-2">Sở thích ăn uống</label>
                    <textarea
                        value={feedback.preferences}
                        onChange={(e) => setFeedback({ ...feedback, preferences: e.target.value })}
                        className="w-full border rounded px-3 py-2 h-24"
                        placeholder="Mô tả sở thích ăn uống của trẻ..."
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    Gửi phản hồi
                </button>
            </form>
        </div>
    );
}

export default Feedback; 