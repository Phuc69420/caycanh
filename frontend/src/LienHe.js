import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const LienHe = () => {
  return (
    <div className="container mt-4 mb-5">
      <div className="row">
        <div className="col-md-9">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Trang chủ</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Liên hệ
              </li>
            </ol>
          </nav>

          <h2 className="text-success fw-bold mb-4">LIÊN HỆ VỚI CHÚNG TÔI</h2>

          <p className="mb-4">
            Nếu bạn có bất kỳ câu hỏi hoặc yêu cầu nào, hãy liên hệ với chúng tôi qua các thông tin dưới đây.
          </p>

          <div className="mb-4">
            <h5 className="text-success fw-bold">Thông tin liên hệ</h5>
            <ul className="list-unstyled">
              <li><i className="bi bi-geo-alt-fill text-success me-2"></i>Địa chỉ: 24 Lê Lâm, Phú Thạnh, Tân Phú, Hồ Chí Minh</li>
              <li><i className="bi bi-telephone-fill text-success me-2"></i>Hotline: 091 606 6249</li>
              <li><i className="bi bi-envelope-fill text-success me-2"></i>Email: info@thegioicaycanh.com</li>
              <li><i className="bi bi-clock-fill text-success me-2"></i>Giờ làm việc: 8:00 - 21:00 (Tất cả các ngày trong tuần)</li>
            </ul>
          </div>

          <h5 className="text-success fw-bold mb-3">Gửi tin nhắn cho chúng tôi</h5>
          <form>
            <div className="mb-3">
              <label className="form-label">Họ và tên</label>
              <input type="text" className="form-control" placeholder="Nhập họ và tên của bạn" />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" placeholder="Nhập email của bạn" />
            </div>
            <div className="mb-3">
              <label className="form-label">Điện thoại</label>
              <input type="text" className="form-control" placeholder="Nhập số điện thoại của bạn" />
            </div>
            <div className="mb-3">
              <label className="form-label">Nội dung</label>
              <textarea className="form-control" rows="4" placeholder="Nhập nội dung tin nhắn"></textarea>
            </div>
            <button type="submit" className="btn btn-success">Gửi đi</button>
          </form>

          <h5 className="text-success fw-bold mt-4">Bản đồ khu vực</h5>
          <div className="map-container mb-4">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.547208501101!2d106.62831407593206!3d10.84614168930383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529ac1f29b7e5%3A0x3f02f7f7f0bce99d!2zMjQgTMOqIEzDom0sIFBow7ogVGjhuqVuaCwgVMOibiBQaMO6LCBI4buTIENow60gTWluaA!5e0!3m2!1sen!2s!4v1648473921667!5m2!1sen!2s"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Thông tin hỗ trợ</h5>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
              <Link to="/huong-dan-mua-hang" className="custom-link">
                  Hướng dẫn mua hàng
                </Link>
              </li>
              <li className="list-group-item">
                <Link to="/hoi-dap" className="custom-link">
                  Câu hỏi thường gặp
                </Link>
              </li>
            </ul>
          </div>

          <div className="card">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Kết nối với chúng tôi</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-around fs-3 mb-3">
                <i className="bi bi-facebook text-primary"></i>
                <i className="bi bi-instagram text-danger"></i>
                <i className="bi bi-youtube text-danger"></i>
                <i className="bi bi-tiktok"></i>
              </div>
              <div className="input-group">
                <input type="email" className="form-control" placeholder="Email của bạn..." />
                <button className="btn btn-success">Đăng ký</button>
              </div>
              <small className="text-muted mt-2 d-block">Đăng ký để nhận thông tin khuyến mãi mới nhất</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LienHe;
