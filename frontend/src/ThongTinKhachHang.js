import React from "react";

const ThongTinKhachHang = ({
  ten,
  setTen,
  email,
  setEmail,
  sdt,
  setSdt,
  diaChi,
  setDiaChi,
  giaoHang,
  setGiaoHang,
  thanhToan,
  setThanhToan,
}) => {
  return (
    <div className="row g-4">
      {/* Thông tin khách hàng */}
      <div className="col-md-6">
        <div className="card p-4 shadow-sm">
          <h4 className="mb-3">👤 Thông tin khách hàng</h4>
          <input type="text" className="form-control mb-3" placeholder="Họ và tên" value={ten} onChange={(e) => setTen(e.target.value)} />
          <input type="email" className="form-control mb-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="tel" className="form-control mb-3" placeholder="Số điện thoại" value={sdt} onChange={(e) => setSdt(e.target.value)} />
          <input type="text" className="form-control mb-3" placeholder="Địa chỉ nhận hàng" value={diaChi} onChange={(e) => setDiaChi(e.target.value)} />
        </div>
      </div>

      {/* Vận chuyển & Thanh toán */}
      <div className="col-md-6">
        <div className="card p-4 shadow-sm mb-4">
          <h4 className="mb-3">🚚 Phương thức giao hàng</h4>
          <select className="form-select" value={giaoHang} onChange={(e) => setGiaoHang(e.target.value)}>
            <option value="Giao tận nơi">Giao tận nơi</option>
            <option value="Nhận tại cửa hàng">Nhận tại cửa hàng</option>
          </select>
        </div>
        <div className="card p-4 shadow-sm">
          <h4 className="mb-3">💳 Phương thức thanh toán</h4>
          <select className="form-select" value={thanhToan} onChange={(e) => setThanhToan(e.target.value)}>
            <option value="COD">Thanh toán khi nhận hàng (COD)</option>
            <option value="Chuyển khoản">Chuyển khoản ngân hàng</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ThongTinKhachHang;