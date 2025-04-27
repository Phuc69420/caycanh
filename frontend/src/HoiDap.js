import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const HoiDap = () => {
  const [cauHoi, setCauHoi] = useState("");
  const [danhSachCauHoi, setDanhSachCauHoi] = useState([
    { question: "Cây cảnh nào dễ chăm sóc nhất?", answer: "Các loại cây như sen đá, xương rồng, hoặc trầu bà rất dễ chăm sóc." },
    { question: "Làm sao để tưới nước đúng cách cho cây cảnh?", answer: "Tùy vào loại cây, bạn nên tưới nước khi thấy đất khô, tránh tưới quá nhiều." },
    { question: "Có những loại cây nào phù hợp để bàn làm việc?", answer: "Những cây như kim ngân, lưỡi hổ, hoặc cây trầu bà là lựa chọn tuyệt vời cho bàn làm việc." },
    { question: "Cây cảnh có cần ánh sáng mặt trời không?", answer: "Hầu hết các cây cảnh đều cần ánh sáng, nhưng một số cây có thể sống tốt trong môi trường ánh sáng yếu như lưỡi hổ hoặc vạn niên thanh." },
  ]);

  const handleGuiCauHoi = () => {
    if (cauHoi.trim() !== "") {
      setDanhSachCauHoi([...danhSachCauHoi, { question: cauHoi, answer: "Chúng tôi sẽ trả lời sớm nhất có thể!" }]);
      setCauHoi("");
    }
  };

  return (
    <div className="container mt-4 hoi-dap-page">
      <div className="row">
        <div className="col-md-9">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Trang chủ</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Hỏi đáp
              </li>
            </ol>
          </nav>

          <h2 className="text-success fw-bold mb-4">HỎI ĐÁP VỀ CÂY CẢNH</h2>

          <div className="mb-4">
            <h5 className="text-success fw-bold mb-3">Đặt câu hỏi của bạn</h5>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Nhập câu hỏi của bạn..."
                value={cauHoi}
                onChange={(e) => setCauHoi(e.target.value)}
              />
              <button className="btn btn-success" onClick={handleGuiCauHoi}>
                Gửi câu hỏi
              </button>
            </div>
          </div>

          <h5 className="text-success fw-bold mb-3">Câu hỏi thường gặp</h5>
          <div className="list-group">
            {danhSachCauHoi.map((item, index) => (
              <div key={index} className="list-group-item">
                <strong>Q: {item.question}</strong>
                <p className="mb-0">A: {item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoiDap;