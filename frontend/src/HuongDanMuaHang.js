import React from "react";
import "./App.css";
import "./HuongDanMuaHang.css";
import { Link } from "react-router-dom";

const HuongDanMuaHang = () => {
  return (
    <div className="huong-dan-mua-hang">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Trang chủ</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/lien-he">Liên hệ</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Hướng dẫn mua hàng
          </li>
        </ol>
      </nav>

      <div className="step">
      <h2>Bước 1: Chọn sản phẩm và đưa vào giỏ hàng</h2>
      <p>
        Tại trang danh sách sản phẩm, nếu Quý khách muốn đưa sản phẩm nào vào giỏ hàng,
        bấm chọn thêm vào giỏ hàng.
      </p>
      <div className="image-container">
        <img src="/images/guide/Bước 1.png" alt="Hướng dẫn mua hàng" />
      </div>
      <p className="note">Các sản phẩm hiện ra trong danh mục sản phẩm</p>
      </div>

      <div className="step">
      <h2>Bước 2: Nhấn vào giỏ hàng</h2>
      <p>
        Nhấn vào icon giỏ hàng để chuyển đến trang giỏ hàng.
      </p>
      <div className="image-container">
        <img src="/images/guide/Bước 2.png" alt="Hướng dẫn mua hàng" />
      </div>
      <p className="note">Nút chuyển đến trang giỏ hàng</p>
      </div>

      <div className="step">
      <h2>Bước 3: Kiểm tra giỏ hàng</h2>
      <p>
        Tại trang giỏ hàng, khách hàng có chọn xóa hàng ra khỏi giỏ hàng, tiếp tục mua sắm hoặc đặt hàng.
      </p>
      <div className="image-container">
        <img src="/images/guide/Bước 3.png" alt="Hướng dẫn mua hàng" />
      </div>
      <p className="note">Các chức năng trong trang giỏ hàng</p>
      </div>

      <div className="step">
      <h2>Bước 4: Nhập thông tin cá nhân và thanh toán</h2>
      <p>
        <ul>
        <li>Nhấn nút Đặt Hàng ở bước 3</li>
        <li>Nhập thông tin cá nhân: (Họ tên, email, số điện thoại, email)</li>
        <li>Chọn phương thức thanh toán</li>
        <li>Nhấn nút Đặt Hàng</li>
        </ul>
      </p>
      <div className="image-container">
        <img src="/images/guide/Bước 4.png" alt="Hướng dẫn mua hàng" />
      </div>
      <p className="note">Các chức năng trong trang thanh toán</p>
      </div>

      </div>
  );
};

export default HuongDanMuaHang;
