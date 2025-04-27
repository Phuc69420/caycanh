import React from "react";
import { Link } from "react-router-dom";

const XacNhanDonHang = ({ gioHang, tongTien, handleDatHang }) => {
  return (
    <div className="card p-4 shadow-sm mt-5">
      <h4 className="mb-3">🧾 Xác nhận đơn hàng</h4>
      {gioHang.length === 0 ? (
        <p>Giỏ hàng trống</p>
      ) : (
        <ul className="list-group mb-3">
          {gioHang.map((sp, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
              <div>{sp.ten_san_pham} x {sp.so_luong}</div>
              <strong>{(sp.gia_san_pham * sp.so_luong).toLocaleString()}đ</strong>
            </li>
          ))}
          <li className="list-group-item d-flex justify-content-between fw-bold">
            <span>Tổng tiền:</span>
            <span>{tongTien.toLocaleString()}đ</span>
          </li>
        </ul>
      )}
      <div className="d-flex justify-content-between">
        <Link to="/" className="btn btn-outline-secondary">← Tiếp tục mua sắm</Link>
        <button className="btn btn-success" onClick={handleDatHang}>Đặt hàng</button>
      </div>
    </div>
  );
};

export default XacNhanDonHang;