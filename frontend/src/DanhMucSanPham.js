import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "./CartContext";
import { toast } from "react-toastify";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./DanhMucSanPham.css";

const DanhMucSanPham = () => {
  const { maDanhMuc } = useParams();
  const [danhMuc, setDanhMuc] = useState(null);
  const [sanPhams, setSanPhams] = useState([]);
  const [sanPhamTuongTu, setSanPhamTuongTu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } }
    ]
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success("✅ Đã thêm vào giỏ hàng!");
  };

  const laySanPhamNgauNhien = (danhSach, soLuong) => {
    const shuffled = [...danhSach].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, soLuong);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [danhMucRes, allSanPhamRes] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/sanpham/danhmuc/${maDanhMuc}`),
          axios.get("http://127.0.0.1:8000/api/sanpham")
        ]);

        setDanhMuc({
          danh_muc: danhMucRes.data.ten_danh_muc,
          san_pham: danhMucRes.data.san_pham || []
        });
        
        setSanPhams(danhMucRes.data.san_pham || []);

        // Lọc bỏ sản phẩm đang xem trong danh sách sản phẩm tương tự
        const otherProducts = allSanPhamRes.data.filter(
          p => p.ma_san_pham !== maDanhMuc
        );
        const randomProducts = laySanPhamNgauNhien(otherProducts, 8);
        setSanPhamTuongTu(randomProducts);

        setLoading(false);
      } catch (err) {
        setError("Không thể tải dữ liệu");
        setLoading(false);
      }
    };

    fetchData();
  }, [maDanhMuc]);

  if (loading) return <div className="container text-center mt-4">Đang tải...</div>;
  if (error) return <div className="container text-center mt-4 text-danger">{error}</div>;
  if (!danhMuc) return <div className="container text-center mt-4">Không tìm thấy danh mục</div>;

  return (
    <div className="container mt-4">
      <h2 className="text-success mb-4">{danhMuc.danh_muc}</h2>

      <div className="row">
        {sanPhams.length > 0 ? (
          sanPhams.map((product) => (
            <div key={product.ma_san_pham} className="col-md-3 mb-4">
              <div className="card h-100">
                <Link to={`/san-pham/${product.ma_san_pham}`} className="text-decoration-none">
                  <img
                    src={`http://127.0.0.1:8000/images/${product.hinh_san_pham}.jpg`}
                    className="card-img-top product-img"
                    alt={product.ten_san_pham}
                  />
                </Link>
                <div className="card-body text-center">
                  <Link to={`/san-pham/${product.ma_san_pham}`} className="text-decoration-none text-dark">
                    <h5 className="card-title">{product.ten_san_pham}</h5>
                  </Link>
                  <p className="text-danger">
                    {Number(product.gia_san_pham).toLocaleString("vi-VN")}đ
                  </p>
                  <button 
                    className="btn btn-success" 
                    onClick={() => handleAddToCart(product)}
                  >
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <h4>Không có sản phẩm nào trong danh mục này</h4>
          </div>
        )}
      </div>

      {/* Phần sản phẩm tương tự với slider */}
      {sanPhamTuongTu.length > 0 && (
        <>
          <h3 className="mt-5 mb-4">Sản phẩm tương tự</h3>
          <div className="position-relative">
            <Slider {...settings}>
              {sanPhamTuongTu.map((product) => (
                <div key={product.ma_san_pham} className="px-2">
                  <div className="card h-100">
                    <Link to={`/san-pham/${product.ma_san_pham}`} className="text-decoration-none">
                      <img
                        src={`http://127.0.0.1:8000/images/${product.hinh_san_pham}.jpg`}
                        className="card-img-top product-img"
                        alt={product.ten_san_pham}
                      />
                    </Link>
                    <div className="card-body text-center">
                      <Link to={`/san-pham/${product.ma_san_pham}`} className="text-decoration-none text-dark">
                        <h5 className="card-title">{product.ten_san_pham}</h5>
                      </Link>
                      <p className="text-danger">
                        {Number(product.gia_san_pham).toLocaleString("vi-VN")}đ
                      </p>
                      <button 
                        className="btn btn-success" 
                        onClick={() => handleAddToCart(product)}
                      >
                        Thêm vào giỏ hàng
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </>
      )}
    </div>
  );
};

export default DanhMucSanPham;