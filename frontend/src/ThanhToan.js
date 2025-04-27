import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";

const ThanhToan = () => {
  const [submitting, setSubmitting] = useState(false);
  const [gioHang, setGioHang] = useState([]);
  const [apiErrors, setApiErrors] = useState({});
  
  // Khởi tạo giỏ hàng từ localStorage
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("gioHang")) || [];
    setGioHang(cart);
  }, []);

  // Tính toán các giá trị từ giỏ hàng
  const { tongSoLuong, tongTienHang, phiShip, tongTienThanhToan } = useMemo(() => {
    const tongSoLuong = gioHang.reduce((sum, sp) => sum + sp.quantity, 0);
    const tongTienHang = gioHang.reduce((sum, sp) => sum + sp.quantity * sp.gia_san_pham, 0);
    const phiShip = tongTienHang >= 500000 ? 0 : 50000;
    const tongTienThanhToan = Math.round(tongTienHang + phiShip);
    
    return { tongSoLuong, tongTienHang, phiShip, tongTienThanhToan };
  }, [gioHang]);

  const [formData, setFormData] = useState({
    ten: "",
    email: "",
    sdt: "",
    diaChi: "",
    thanhToan: "COD"
  });

  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [dsTinh, setDsTinh] = useState([]);
  const [dsHuyen, setDsHuyen] = useState([]);
  const [dsXa, setDsXa] = useState([]);
  const [tinh, setTinh] = useState(null);
  const [huyen, setHuyen] = useState(null);
  const [xa, setXa] = useState(null);
  const [loadingTinh, setLoadingTinh] = useState(false);
  const [loadingHuyen, setLoadingHuyen] = useState(false);
  const [loadingXa, setLoadingXa] = useState(false);

  // Fetch danh sách tỉnh
  useEffect(() => {
    const fetchTinh = async () => {
      setLoadingTinh(true);
      try {
        const res = await fetch("http://127.0.0.1:8000/api/diachi/tinh");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setDsTinh(data || []);
      } catch (err) {
        toast.error("Lỗi khi tải danh sách tỉnh/thành");
        setDsTinh([]);
      } finally {
        setLoadingTinh(false);
      }
    };
    fetchTinh();
  }, []);

  // Fetch danh sách quận/huyện khi tỉnh thay đổi
  useEffect(() => {
    const fetchHuyen = async () => {
      if (!tinh || !tinh.code) return;

      setLoadingHuyen(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/diachi/quan-huyen/${tinh.code}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setDsHuyen(data || []);
        setHuyen(null);
        setXa(null);
      } catch (err) {
        toast.error("Lỗi khi tải danh sách quận/huyện");
        setDsHuyen([]);
      } finally {
        setLoadingHuyen(false);
      }
    };
    fetchHuyen();
  }, [tinh]);

  // Fetch danh sách xã khi huyện thay đổi
  useEffect(() => {
    const fetchXa = async () => {
      if (!huyen || !huyen.code) return;

      setLoadingXa(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/diachi/phuong-xa/${huyen.code}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setDsXa(data || []);
        setXa(null);
      } catch (err) {
        toast.error("Lỗi khi tải danh sách phường/xã");
        setDsXa([]);
      } finally {
        setLoadingXa(false);
      }
    };
    fetchXa();
  }, [huyen]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error khi người dùng thay đổi giá trị
    setApiErrors(prev => ({ ...prev, [name]: undefined }));
  }, []);

  const validateInputs = useCallback(() => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^0\d{9}$/;

    if (!formData.ten.trim()) {
      errors.ten = "Vui lòng nhập họ tên!";
    }
    if (!emailRegex.test(formData.email)) {
      errors.email = "Email không hợp lệ!";
    }
    if (!phoneRegex.test(formData.sdt)) {
      errors.sdt = "Số điện thoại phải gồm 10 số và bắt đầu bằng 0!";
    }
    if (!formData.diaChi.trim()) {
      errors.diaChi = "Vui lòng nhập địa chỉ cụ thể!";
    }
    if (!tinh) {
      errors.tinh = "Vui lòng chọn tỉnh/thành phố!";
    }
    if (!huyen) {
      errors.huyen = "Vui lòng chọn quận/huyện!";
    }
    if (!xa) {
      errors.xa = "Vui lòng chọn phường/xã!";
    }
    if (gioHang.length === 0) {
      toast.error("Giỏ hàng đang trống!");
      return false;
    }

    if (Object.keys(errors).length > 0) {
      setApiErrors(errors);
      Object.values(errors).forEach(err => toast.error(err));
      return false;
    }

    return true;
  }, [formData, tinh, huyen, xa, gioHang]);

  const handleDatHang = useCallback(async () => {
    if (!validateInputs()) return;
    setSubmitting(true);
    setApiErrors({}); // Reset errors trước khi gọi API

    const dataToSend = {
      ten_khach_hang: formData.ten.trim(),
      email_kh: formData.email.trim(),
      sdt_kh: formData.sdt.trim(),
      tinh_thanh_pho: tinh.name,  
      quan_huyen: huyen.name, 
      phuong_xa: xa.name,  
      dia_chi_giao_hang: formData.diaChi.trim(),
      phuong_thuc_thanh_toan: formData.thanhToan,
      tong_tien_hang: tongTienHang,
      phi_ship: phiShip,
      tong_so_tien: tongTienThanhToan,
      items: gioHang.map(sp => ({
        ma_san_pham: sp.ma_san_pham,
        ten_san_pham: sp.ten_san_pham,
        gia: sp.gia_san_pham,
        so_luong: sp.quantity,
      })),
    };

    try {
      // Gọi API đặt hàng
      const res = await fetch("http://127.0.0.1:8000/api/dat-hang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const data = await res.json();

      if (!res.ok) {
        // Xử lý lỗi từ server
        if (data.errors) {
          setApiErrors(data.errors);
          Object.values(data.errors).forEach(err => toast.error(err[0]));
        } else {
          toast.error(data.message || "Đặt hàng thất bại. Vui lòng thử lại!");
        }
        return;
      }

      // Xử lý thành công - COD
      if (formData.thanhToan === "COD") {
        toast.success("🎉 Đặt hàng thành công!", { autoClose: 1500 });
        setTimeout(() => {
          localStorage.removeItem("gioHang");
          window.location.href = `/thank-you?orderId=${data.order_id}&clearCart=1`;
        }, 1500);
        return;
      }

      // Xử lý thanh toán MoMo
      const momoPayload = {
        orderId: data.order_id.toString(),
        amount: tongTienThanhToan,
        orderInfo: `Thanh toán đơn hàng ${data.order_id}`,
        customerName: formData.ten.trim(),
        customerEmail: formData.email.trim(),
        customerPhone: formData.sdt.trim()
      };

      const momoRes = await fetch("http://127.0.0.1:8000/api/momo/create", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(momoPayload),
      });

      const momoData = await momoRes.json();

      if (!momoRes.ok) {
        throw new Error(momoData.message || "Lỗi khi tạo thanh toán MoMo");
      }

      // Xử lý response từ MoMo
      if (momoData.payUrl) {
        toast.success("🔄 Đang chuyển hướng đến MoMo...", { autoClose: 1500 });
        setTimeout(() => {
          localStorage.removeItem("gioHang");
          window.location.href = momoData.payUrl;
        }, 1500);
      } else if (momoData.qrCodeUrl) {
        localStorage.removeItem("gioHang");
        setQrCodeUrl(momoData.qrCodeUrl);
      } else {
        toast.error(momoData.message || "Lỗi thanh toán MoMo");
      }
    } catch (err) {
      console.error("Lỗi đặt hàng:", err);
      toast.error(err.message || "Lỗi kết nối server!");
    } finally {
      setSubmitting(false);
    }
  }, [validateInputs, formData, tinh, huyen, xa, gioHang, tongTienHang, phiShip, tongTienThanhToan]);

  // Format tiền tệ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value) + ' VNĐ';
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-7">
          <h4>Chi Tiết Giỏ Hàng</h4>
          {gioHang.length > 0 ? (
            <>
              <table className="table table-bordered text-center">
                <thead className="table-light">
                  <tr>
                    <th>Hình Ảnh</th>
                    <th>Tên Sách</th>
                    <th>Giá</th>
                    <th>Số Lượng</th>
                    <th>Thành Tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {gioHang.map((sp) => (
                    <tr key={`cart-item-${sp.ma_san_pham}-${sp.quantity}`}>
                      <td>
                        <img
                          src={`http://127.0.0.1:8000/images/${sp.hinh_san_pham}.jpg`}
                          alt={sp.ten_san_pham}
                          width={50}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/50";
                          }}
                        />
                      </td>
                      <td>{sp.ten_san_pham}</td>
                      <td>{formatCurrency(sp.gia_san_pham)}</td>
                      <td>{sp.quantity}</td>
                      <td>{formatCurrency(sp.gia_san_pham * sp.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 p-3 bg-light rounded">
                <p><strong>Tổng Số Lượng:</strong> {tongSoLuong}</p>
                <p><strong>Tổng tiền hàng:</strong> {formatCurrency(tongTienHang)}</p>
                <p><strong>Phí vận chuyển:</strong> {formatCurrency(phiShip)}</p>
                <h5 className="text-danger">
                  <strong>Tổng thanh toán:</strong> {formatCurrency(tongTienThanhToan)}
                </h5>
              </div>
            </>
          ) : (
            <div className="alert alert-warning">Giỏ hàng của bạn đang trống</div>
          )}
          <button 
            className="btn btn-outline-success mt-3" 
            onClick={() => window.location.href = "/gio-hang"}
          >
            ← Quay lại giỏ hàng
          </button>
        </div>

        <div className="col-md-5">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-4">1. THÔNG TIN HÓA ĐƠN</h4>

              <div className="mb-3">
                <label className="form-label">Họ Tên *</label>
                <input
                  type="text"
                  className={`form-control ${apiErrors.ten ? 'is-invalid' : ''}`}
                  placeholder="Nhập họ tên"
                  name="ten"
                  value={formData.ten}
                  onChange={handleChange}
                  required
                />
                {apiErrors.ten && <div className="invalid-feedback">{apiErrors.ten}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className={`form-control ${apiErrors.email ? 'is-invalid' : ''}`}
                  placeholder="Nhập email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {apiErrors.email && <div className="invalid-feedback">{apiErrors.email}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Số Điện Thoại *</label>
                <input
                  type="tel"
                  className={`form-control ${apiErrors.sdt ? 'is-invalid' : ''}`}
                  placeholder="Nhập số điện thoại"
                  name="sdt"
                  value={formData.sdt}
                  onChange={handleChange}
                  pattern="0\d{9}"
                  required
                />
                <small className="text-muted">Ví dụ: 0987654321</small>
                {apiErrors.sdt && <div className="invalid-feedback">{apiErrors.sdt}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Tỉnh/Thành phố *</label>
                <select
                  className={`form-select ${apiErrors.tinh ? 'is-invalid' : ''}`}
                  value={tinh?.code || ""}
                  onChange={(e) => {
                    const selected = dsTinh.find(t => t.code.toString() === e.target.value);
                    setTinh(selected);
                    setApiErrors(prev => ({ ...prev, tinh: undefined }));
                  }}
                  disabled={loadingTinh}
                  required
                >
                  <option value="">-- Chọn tỉnh/thành phố --</option>
                  {dsTinh.map((tinh) => (
                    <option key={`tinh-${tinh.code}`} value={tinh.code}>
                      {tinh.name}
                    </option>
                  ))}
                </select>
                {apiErrors.tinh && <div className="invalid-feedback">{apiErrors.tinh}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Quận/Huyện *</label>
                <select
                  className={`form-select ${apiErrors.huyen ? 'is-invalid' : ''}`}
                  value={huyen?.code || ""}
                  onChange={(e) => {
                    const selected = dsHuyen.find(h => h.code.toString() === e.target.value);
                    setHuyen(selected);
                    setApiErrors(prev => ({ ...prev, huyen: undefined }));
                  }}
                  disabled={!tinh || loadingHuyen}
                  required
                >
                  <option value="">{loadingHuyen ? "Đang tải..." : "Chọn quận/huyện"}</option>
                  {dsHuyen.map((huyen) => (
                    <option key={`huyen-${huyen.code}`} value={huyen.code}>
                      {huyen.name}
                    </option>
                  ))}
                </select>
                {apiErrors.huyen && <div className="invalid-feedback">{apiErrors.huyen}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Phường/Xã *</label>
                <select
                  className={`form-select ${apiErrors.xa ? 'is-invalid' : ''}`}
                  value={xa?.code || ""}
                  onChange={(e) => {
                    const selected = dsXa.find(x => x.code.toString() === e.target.value);
                    setXa(selected);
                    setApiErrors(prev => ({ ...prev, xa: undefined }));
                  }}
                  disabled={!huyen || loadingXa}
                  required
                >
                  <option value="">{loadingXa ? "Đang tải..." : "Chọn phường/xã"}</option>
                  {dsXa.map((xa) => (
                    <option key={`xa-${xa.code}`} value={xa.code}>
                      {xa.name}
                    </option>
                  ))}
                </select>
                {apiErrors.xa && <div className="invalid-feedback">{apiErrors.xa}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Địa Chỉ Cụ Thể *</label>
                <input
                  type="text"
                  className={`form-control ${apiErrors.diaChi ? 'is-invalid' : ''}`}
                  placeholder="Số nhà, tên đường..."
                  name="diaChi"
                  value={formData.diaChi}
                  onChange={handleChange}
                  required
                />
                {apiErrors.diaChi && <div className="invalid-feedback">{apiErrors.diaChi}</div>}
              </div>

              <div className="mb-4">
                <label className="form-label mb-3">Phương Thức Thanh Toán *</label>
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="thanhToan"
                    id="cod"
                    value="COD"
                    checked={formData.thanhToan === "COD"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="cod">
                    Thanh toán khi nhận hàng (COD)
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="thanhToan"
                    id="momo"
                    value="QR_MOMO"
                    checked={formData.thanhToan === "QR_MOMO"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="momo">
                    Thanh toán qua MoMo
                  </label>
                </div>
              </div>

              <button
                className="btn btn-primary w-100 py-2"
                onClick={handleDatHang}
                disabled={gioHang.length === 0 || submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Đang xử lý...
                  </>
                ) : gioHang.length === 0 ? (
                  "Giỏ hàng trống"
                ) : (
                  "Đặt Hàng"
                )}
              </button>

              {qrCodeUrl && (
                <div className="mt-4 text-center">
                  <h5>Quét mã QR để thanh toán với MoMo</h5>
                  <img 
                    src={qrCodeUrl} 
                    alt="QR MoMo" 
                    className="img-fluid border p-2" 
                    style={{ maxWidth: '300px', background: 'white' }} 
                  />
                  <p className="mt-2 text-muted">Vui lòng quét mã QR trong vòng 15 phút</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThanhToan;