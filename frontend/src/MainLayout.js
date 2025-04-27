import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import axios from "axios";
import "./App.css";
import { useNavigate } from 'react-router-dom';
import { Routes, Route, Link } from "react-router-dom";
import GioHang from "./GioHang";
import { useCart } from "./CartContext";
import GioiThieu from "./GioiThieu";
import { toast } from "react-toastify";
import ThanhToan from "./ThanhToan";  
import Hoidap from "./HoiDap";
import TinTuc from "./TinTuc";
import LienHe from "./LienHe";
import ThankYou from "./ThankYou";
import TinTucDetail from './TinTucDetail';
import DanhMucSanPham from "./DanhMucSanPham";
import ThongTinSanPham from './ThongTinSanPham';
import TimKiem from "./TimKiem";
import HuongDanMuaHang from "./HuongDanMuaHang";
import { authService } from "./services/authService";

// Trang chủ
const HomePage = () => {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [hotProducts, setHotProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success("✅ Đã thêm vào giỏ hàng!");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/sanpham"),
          axios.get("http://127.0.0.1:8000/api/sanpham/danhmuc")
        ]);

        const products = productsRes.data;
        const allCategories = categoriesRes.data;

        // Lấy 8 sản phẩm ngẫu nhiên làm sản phẩm bán chạy
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        setHotProducts(shuffled.slice(0, 8));

        // Nhóm sản phẩm theo danh mục
        const grouped = {};
        allCategories.forEach(category => {
          grouped[category.ten_danh_muc] = products.filter(
            product => product.ma_danh_muc === category.ma_danh_muc
          );
        });

        setGroupedProducts(grouped);
        setCategories(allCategories);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải sản phẩm.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chunkArray = (arr, size) => {
    const chunked = [];
    for (let i = 0; i < arr.length; i += size) {
      chunked.push(arr.slice(i, i + size));
    }
    return chunked;
  };

  if (loading) return <div className="container text-center mt-4">Đang tải...</div>;
  if (error) return <div className="container text-center mt-4 text-danger">{error}</div>;

  return (
    <div className="container mt-4">
      {/* Danh mục + Slide */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="category-box shadow-sm">
            <h5 className="text-success mb-3">DANH MỤC SẢN PHẨM</h5>
            <ul className="list-group list-group-flush">
              {categories.map((category) => (
                <li className="list-group-item" key={category.ma_danh_muc}>
                  <Link 
                    to={`/danh-muc/${category.ma_danh_muc}`} 
                    className="text-decoration-none text-dark"
                  >
                    {category.ten_danh_muc}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-md-9">
          <div
            id="carouselExampleIndicators"
            className="carousel slide rounded-4 overflow-hidden"
            data-bs-ride="carousel"
            data-bs-interval="3000"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img src="/slides/slide1.jpg" className="d-block w-100 slide-img" alt="Slide 1" />
              </div>
              <div className="carousel-item">
                <img src="/slides/slide2.jpg" className="d-block w-100 slide-img" alt="Slide 2" />
              </div>
              <div className="carousel-item">
                <img src="/slides/slide3.jpg" className="d-block w-100 slide-img" alt="Slide 3" />
              </div>
            </div>
            <button className="carousel-control-prev custom-arrow" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
              <span className="carousel-control-prev-icon custom-icon"></span>
            </button>
            <button className="carousel-control-next custom-arrow" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
              <span className="carousel-control-next-icon custom-icon"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Sản phẩm bán chạy */}
      <div className="mb-5">
        <h3 className="text-danger mb-4 text-center fw-bold">🔥 Sản phẩm bán chạy</h3>
        <div id="hotProductCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            {chunkArray(hotProducts, 4).map((group, index) => (
              <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={index}>
                <div className="row">
                  {group.map((product) => (
                    <div className="col-md-3 mb-3" key={product.ma_san_pham}>
                      <div className="card h-100">
                        <Link to={`/san-pham/${product.ma_san_pham}`}>
                          <img
                            src={`http://127.0.0.1:8000/images/${product.hinh_san_pham}.jpg`}
                            className="card-img-top product-img"
                            alt={product.ten_san_pham}
                          />
                        </Link>
                        <div className="card-body text-center">
                          <h5 className="card-title">
                            <Link to={`/san-pham/${product.ma_san_pham}`} className="text-decoration-none text-dark">
                              {product.ten_san_pham}
                            </Link>
                          </h5>
                          <p className="text-danger">
                            {Number(product.gia_san_pham).toLocaleString("vi-VN")}đ
                          </p>
                          <button className="btn btn-outline-danger" onClick={() => handleAddToCart(product)}>
                            Thêm vào giỏ hàng
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#hotProductCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon"></span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#hotProductCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>

      {/* Sản phẩm theo danh mục */}
      {Object.entries(groupedProducts).map(([categoryName, products]) => (
        products.length > 0 && (
          <div key={categoryName} className="mb-5">
            <h3 className="text-success mb-3">{categoryName}</h3>
            <div className="row">
              {products.map((product) => (
                <div key={product.ma_san_pham} className="col-md-3 mb-4">
                  <div className="card h-100">
                    <Link to={`/san-pham/${product.ma_san_pham}`}>
                      <img
                        src={`http://127.0.0.1:8000/images/${product.hinh_san_pham}.jpg`}
                        className="card-img-top product-img"
                        alt={product.ten_san_pham}
                      />
                    </Link>
                    <div className="card-body text-center">
                      <h5 className="card-title">
                        <Link to={`/san-pham/${product.ma_san_pham}`} className="text-decoration-none text-dark">
                          {product.ten_san_pham}
                        </Link>
                      </h5>
                      <p className="text-danger">
                        {Number(product.gia_san_pham).toLocaleString("vi-VN")}đ
                      </p>
                      <button className="btn btn-success" onClick={() => handleAddToCart(product)}>
                        Thêm vào giỏ hàng
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
};

// App component
const App = () => {
  const { totalItems } = useCart();
  const [tuKhoa, setTuKhoa] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    // Update user state when localStorage changes
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem('user')));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.dangXuat();
      setUser(null);
      navigate('/dang-nhap');
      toast.success('Đăng xuất thành công');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Đăng xuất thất bại');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (tuKhoa.trim() !== "") {
      navigate(`/tim-kiem?q=${encodeURIComponent(tuKhoa)}`);
      setTuKhoa(""); // Reset lại ô tìm kiếm sau khi tìm
    }
  };
  
  return (
    <>
      {/* Top bar */}
      <div className="top-bar">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="left-info">📢 Nhóm 13</div>
          <div className="center-phone text-center flex-grow-1">📞 0909 123 456</div>
          <div className="right-links">
            {user ? (
              <div className="dropdown">
                <button 
                  className="btn btn-link dropdown-toggle text-white text-decoration-none"
                  type="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  👤 Xin chào, {user.name}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <div className="dropdown-item-text">
                      <small className="text-muted">Thông tin tài khoản</small>
                      <div><strong>Email:</strong> {user.email}</div>
                      <div><strong>SĐT:</strong> {user.phone}</div>
                      <div><strong>Địa chỉ:</strong> {user.address}</div>
                    </div>
                  </li>
                  <li><hr className="dropdown-divider"/></li>
                  <li>
                    <button 
                      className="dropdown-item text-danger" 
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right"></i> Đăng xuất
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="/dang-nhap">Đăng nhập</Link>
                <Link to="/dang-ky">Đăng ký</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-green-fresh p-3">
        <div className="container d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <Link className="navbar-brand" to="/">
              <img src="/logo/logo.jpg" alt="Logo" height="100" />
            </Link>
            <span
              className="text-success fw-bold fs-4 ms-5 d-flex align-items-center"
              style={{ fontFamily: "'Pacifico', cursive" }}
            >
              Thế giới cây cảnh - Đến là mua
            </span>
          </div>

          <div className="d-flex align-items-center gap-3 w-50">
             {/* Thêm thanh tìm kiếm */}
             <form className="input-group w-100" onSubmit={handleSearchSubmit}>
              <input
                type="search"
                className="form-control"
                placeholder="Tìm kiếm..."
                aria-label="Tìm kiếm"
                value={tuKhoa}
                onChange={(e) => setTuKhoa(e.target.value)}
              />
              <button
                type="submit"
                className="input-group-text text-white"
                style={{ backgroundColor: "#28a745" }}
              >
                <i className="bi bi-search"></i>
              </button>
            </form>

            <Link to="/gio-hang" className="btn position-relative gio-hang-btn">
              <span className="cart-icon">🛒</span>
              {totalItems > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger cart-badge"
                >
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Menu ngang */}
      <div className="shadow-sm">
        <div className="container menu-bar">
          <ul className="nav justify-content-between py-2">
            <li className="nav-item flex-fill text-center">
              <Link className="nav-link menu-link active" to="/">TRANG CHỦ</Link>
            </li>
            <li className="nav-item flex-fill text-center">
              <Link className="nav-link menu-link" to="/gioi-thieu">GIỚI THIỆU</Link>
            </li>
            <li className="nav-item flex-fill text-center">
              <Link className="nav-link menu-link" to="/lien-he">LIÊN HỆ</Link>
            </li>
            <li className="nav-item flex-fill text-center">
              <Link className="nav-link menu-link" to="/tin-tuc">TIN TỨC</Link>
            </li>
            <li className="nav-item flex-fill text-center">
              <Link className="nav-link menu-link" to="/hoi-dap">HỎI ĐÁP</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Route nội dung */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gio-hang" element={<GioHang />} />
        <Route path="/gioi-thieu" element={<GioiThieu />} />
        <Route path="/thanh-toan" element={<ThanhToan />} />
        <Route path="/hoi-dap" element={<Hoidap />} />
        <Route path="/tin-tuc" element={<TinTuc />} />
        <Route path="/lien-he" element={<LienHe />} />
        <Route path="/tin-tuc/:id" element={<TinTucDetail />} />
        <Route path="/danh-muc/:maDanhMuc" element={<DanhMucSanPham />} />
        <Route path="/san-pham/:maSanPham" element={<ThongTinSanPham />} />
        <Route path="/huong-dan-mua-hang" element={<HuongDanMuaHang />} />
        <Route path="/tim-kiem" element={<TimKiem />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
    </>
  );
};

export default App;