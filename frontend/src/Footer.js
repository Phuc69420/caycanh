import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer style={{ backgroundColor: "#4CAF50" }} className="text-light pt-4 pb-2 mt-5">
      <div className="container">
        <div className="row">
          {/* Cột 1: Thông tin cửa hàng */}
          <div className="col-md-4">
            <h5>🌿 Thế Giới Cây Cảnh</h5>
            <p>Chuyên cung cấp cây cảnh, bonsai, sen đá và phụ kiện chăm sóc cây.</p>
            <p><i className="bi bi-geo-alt"></i> Địa chỉ: 123 Nguyễn Trãi, Hà Nội</p>
            <p><i className="bi bi-telephone"></i> Hotline: 0909 123 456</p>
            <p><i className="bi bi-envelope"></i> Email: info@thegioicaycanh.com</p>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div className="col-md-4">
            <h5>🔗 Liên Kết</h5>
            <ul className="list-unstyled">
              <li><Link className="footer-link" to="/">🏠 Trang chủ</Link></li>
              <li><Link className="footer-link" to="/gioi-thieu">ℹ️ Giới thiệu</Link></li>
              <li><Link className="footer-link" to="/tin-tuc">📰 Tin tức</Link></li>
              <li><Link className="footer-link" to="/hoi-dap">❓ Hỏi đáp</Link></li>
              <li><Link className="footer-link" to="/lien-he">📞 Liên hệ</Link></li>
            </ul>
          </div>

          {/* Cột 3: Mạng xã hội */}
          <div className="col-md-4">
            <h5>📱 Kết Nối Với Chúng Tôi</h5>
            <p>Theo dõi chúng tôi trên các nền tảng mạng xã hội:</p>
            <div className="d-flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link"><i className="bi bi-facebook"></i></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link"><i className="bi bi-instagram"></i></a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="social-link"><i className="bi bi-tiktok"></i></a>
            </div>
          </div>
        </div>

           {/* Copyright */}
           <hr className="border-light" />
        <div className="text-center">
          <p className="mb-0">
            © 2025 Thế Giới Cây Cảnh. All rights reserved.
            {" "}
            <Link 
              to="/admin" 
              className="ms-2" 
              style={{ color: "#ddd", fontSize: "12px", opacity: 0.7, textDecoration: "none" }}
            >
              Quản trị viên
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
