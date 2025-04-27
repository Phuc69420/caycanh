// src/GioHang.jsx
import React, { useState } from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GioHang = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");

  const tinhTong = () => {
    return cartItems.reduce((sum, item) => sum + item.gia_san_pham * item.quantity, 0);
  };

  const handleDecrease = (productId, currentQuantity) => {
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    }
  };

  const handleIncrease = (productId, currentQuantity) => {
    updateQuantity(productId, currentQuantity + 1);
  };

  const handleTraCuu = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/tra-cuu-don-hang", {
        params: { query: searchQuery },
      });
      setSearchResult(response.data);
      setSearchError("");
    } catch (error) {
      console.error("Lỗi tra cứu:", error);
      setSearchResult(null);
      setSearchError("Không tìm thấy đơn hàng hoặc xảy ra lỗi.");
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">🛒 Giỏ Hàng</h3>

      {/* --- Giỏ hàng chính --- */}
      {cartItems.length === 0 ? (
        <p>Giỏ hàng trống.</p>
      ) : (
        <>
          <table className="table table-bordered text-center">
            <thead className="table-light">
              <tr>
                <th>STT</th>
                <th>Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th>Xóa</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={item.ma_san_pham}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={`http://127.0.0.1:8000/images/${item.hinh_san_pham}.jpg`}
                      alt={item.ten_san_pham}
                      width="80"
                      height="80"
                      style={{ objectFit: "cover", borderRadius: "8px" }}
                    />
                  </td>
                  <td>{item.ten_san_pham}</td>
                  <td>{Number(item.gia_san_pham).toLocaleString("vi-VN")} đ</td>
                  <td>
                    <div className="d-flex justify-content-center align-items-center">
                      <button
                        className="btn btn-outline-secondary btn-sm me-2"
                        onClick={() => handleDecrease(item.ma_san_pham, item.quantity)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm ms-2"
                        onClick={() => handleIncrease(item.ma_san_pham, item.quantity)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>
                    {(item.gia_san_pham * item.quantity).toLocaleString("vi-VN")} đ
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeFromCart(item.ma_san_pham)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-end fw-bold text-danger">
            Tổng cộng: {tinhTong().toLocaleString("vi-VN")} đ
          </div>
          <div className="d-flex justify-content-between mt-4">
            <a href="/" className="btn btn-outline-secondary">
              ← Tiếp tục mua sắm
            </a>
            <button className="btn btn-success" onClick={() => navigate("/thanh-toan")}>
              Đặt hàng
            </button>
          </div>
        </>
      )}

      {/* --- Tra cứu đơn hàng --- */}
      <div className="mt-5">
        <h4>🔍 Tra cứu đơn hàng</h4>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nhập số điện thoại hoặc email của bạn để tra cứu đơn hàng"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleTraCuu}>
            Tra cứu
          </button>
        </div>

        {/* Kết quả tra cứu */}
        {Array.isArray(searchResult) && searchResult.length > 0 && (
          <div className="mt-4">
            <h5 className="mb-3">📦 Đơn hàng của bạn:</h5>
            {searchResult.map((donHang, index) => {
              const tongTien = donHang.san_pham.reduce(
                (sum, sp) => sum + parseFloat(sp.tong_gia),
                0
              );

              return (
                <div key={index} className="mb-5">
                  <div className="d-flex justify-content-start align-items-center mb-2">
                    <span
                      className={`badge text-uppercase px-3 py-2 fs-6 ${
                        donHang.trang_thai === "chờ xử lý"
                          ? "bg-warning text-dark"
                          : donHang.trang_thai === "đang giao"
                          ? "bg-info text-dark"
                          : donHang.trang_thai === "đã giao"
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    >
                      {donHang.trang_thai}
                    </span>
                  </div>

                  <table className="table table-bordered align-middle text-center">
                    <thead className="table-light">
                      <tr>
                        <th>STT</th>
                        <th>Hình ảnh</th>
                        <th>Tên sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Đơn giá</th>
                        <th>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donHang.san_pham.map((sp, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>
                            <img
                              src={`http://127.0.0.1:8000/images/${sp.hinh_anh}.jpg`}
                              alt={sp.ten_san_pham}
                              width="70"
                              height="70"
                              style={{ objectFit: "cover", borderRadius: "8px" }}
                            />
                          </td>
                          <td>{sp.ten_san_pham}</td>
                          <td>{sp.so_luong}</td>
                          <td>{Number(sp.gia).toLocaleString("vi-VN")} đ</td>
                          <td>{Number(sp.tong_gia).toLocaleString("vi-VN")} đ</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan="5" className="text-end fw-bold">
                          Tổng tiền:
                        </td>
                        <td className="fw-bold text-danger">
                          {tongTien.toLocaleString("vi-VN")} đ
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        )}

        {/* Nếu không có kết quả */}
        {searchResult && Array.isArray(searchResult) && searchResult.length === 0 && (
          <div className="alert alert-warning mt-3">
            Không tìm thấy đơn hàng phù hợp.
          </div>
        )}

        {/* Nếu có lỗi */}
        {searchError && (
          <div className="alert alert-danger mt-3">{searchError}</div>
        )}
      </div>
    </div>
  );
};

export default GioHang;
