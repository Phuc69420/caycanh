import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCart } from './CartContext';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './ThongTinSanPham.css';

const ThongTinSanPham = () => {
  const { maSanPham } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  
  // Thêm state để lưu danh sách ảnh và ảnh đang được chọn
  const [productImages, setProductImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 10000,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
  };
  
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [productRes, allProductsRes] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/sanpham/${maSanPham}`),
          axios.get('http://127.0.0.1:8000/api/sanpham')
        ]);

        if (!productRes.data.success) {
          throw new Error('Sản phẩm không tồn tại');
        }

        const currentProduct = productRes.data.san_pham;
        const allProducts = allProductsRes.data.san_pham || allProductsRes.data || [];

        setProduct(currentProduct);

        // Thiết lập danh sách ảnh sản phẩm (giả định có danh sách hình ảnh hoặc tạo từ hinh_san_pham)
        // Nếu API trả về mảng hình ảnh, sử dụng mảng đó. Nếu không, tạo mảng mẫu từ ảnh chính
        const imagesToShow = currentProduct.hinh_anh_phu 
          ? [currentProduct.hinh_san_pham, ...currentProduct.hinh_anh_phu] 
          : [
              currentProduct.hinh_san_pham,
              `${currentProduct.hinh_san_pham}_phu1`, 
              `${currentProduct.hinh_san_pham}_phu2`,
              `${currentProduct.hinh_san_pham}_phu3`
            ];
        
        setProductImages(imagesToShow);
        setSelectedImageIndex(0); // Mặc định chọn ảnh đầu tiên (ảnh chính)

        const sameCategoryProducts = allProducts.filter(
          p => String(p.ma_danh_muc) === String(currentProduct.danh_muc.ma_danh_muc) &&
               p.ma_san_pham !== currentProduct.ma_san_pham
        );

        setRelatedProducts(sameCategoryProducts.slice(0, 8));

      } catch (err) {
        setError(err.message || 'Không thể tải thông tin sản phẩm');
        toast.error(err.message || 'Lỗi khi tải thông tin sản phẩm');

        if (err.message === 'Sản phẩm không tồn tại') {
          navigate('/not-found', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [maSanPham, navigate]);

  const handleAddToCart = () => {
    if (!product) return;
  
    addToCart({
      ma_san_pham: product.ma_san_pham,
      ten_san_pham: product.ten_san_pham,
      gia_san_pham: Number(product.gia_san_pham) || 0,
      hinh_san_pham: product.hinh_san_pham || 'placeholder',
      so_luong: 1
    });
  
    toast.success('✅ Đã thêm vào giỏ hàng!');
  };
  
  
  // Hàm xử lý khi click vào ảnh phụ
  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle-fill fs-1"></i>
          <p className="mt-3">{error || 'Sản phẩm không tồn tại'}</p>
        </div>
        <Link to="/" className="btn btn-success mt-3">
          <i className="bi bi-house-door me-2"></i>Quay về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-success text-decoration-none">
              <i className="bi bi-house-door me-1"></i>Trang chủ
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/danh-muc/${product.danh_muc.ma_danh_muc}`} className="text-success text-decoration-none">
              {product.danh_muc.ten_danh_muc}
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {product.ten_san_pham}
          </li>
        </ol>
      </nav>

      {/* Thông tin sản phẩm */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            {/* Ảnh chính */}
            <div className="ratio ratio-1x1">
              <img
                src={`http://127.0.0.1:8000/images/${productImages[selectedImageIndex]}.jpg`}
                className="img-fluid rounded-3 object-fit-contain bg-light"
                alt={product.ten_san_pham}
                onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder.jpg'; }}
                loading="lazy"
                style={{ transition: 'opacity 0.3s ease', opacity: 0 }}
                onLoad={(e) => { e.target.style.opacity = 1; }}
              />
            </div>
            
            {/* Thêm phần hiển thị các ảnh phụ */}
            <div className="d-flex justify-content-center mt-3 gap-2">
              {productImages.slice(0, 4).map((img, index) => (
                <div 
                  key={index}
                  className={`thumbnail-container cursor-pointer ${selectedImageIndex === index ? 'border border-success' : 'border'}`}
                  onClick={() => handleThumbnailClick(index)}
                  style={{ 
                    width: '70px', 
                    height: '70px',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    borderRadius: '4px'
                  }}
                >
                  <img
                    src={`http://127.0.0.1:8000/images/${img}.jpg`}
                    className="img-fluid object-fit-cover h-100 w-100"
                    alt={`${product.ten_san_pham} - Ảnh ${index + 1}`}
                    onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder.jpg'; }}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <h1 className="fw-bold mb-3">{product.ten_san_pham}</h1>
          <div className="d-flex align-items-center mb-4">
            <span className="text-danger fs-3 fw-bold me-3">
              {Number(product.gia_san_pham).toLocaleString('vi-VN')}đ
            </span>
            {product.gia_goc && (
              <span className="text-decoration-line-through text-muted">
                {Number(product.gia_goc).toLocaleString('vi-VN')}đ
              </span>
            )}
          </div>
          <div className="d-flex flex-wrap gap-3 mb-4">
            <button className="btn btn-success btn-lg px-4" onClick={handleAddToCart}>
              <i className="bi bi-cart-plus me-2"></i> Thêm vào giỏ hàng
            </button>
            <button className="btn btn-outline-success btn-lg px-4">
              <i className="bi bi-heart me-2"></i> Yêu thích
            </button>
          </div>

          <div className="card mb-4 border-0 shadow-sm">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="bi bi-info-circle me-2"></i>Mô tả sản phẩm
              </h5>
            </div>
            <div className="mb-0">
            {(product.mo_ta || 'Đang cập nhật...').split('.').map((sentence, index) => (
              sentence.trim() && <p key={index} className="mb-1">{sentence.trim()}.</p>
            ))}
          </div>

          </div>
        </div>
      </div>

      {/* Thông tin chi tiết */}
      {product.thong_tin_chi_tiet && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">
                  <i className="bi bi-card-checklist me-2"></i>Thông tin chi tiết
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  {product.thong_tin_chi_tiet.gioi_thieu && (
                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded h-100">
                        <h6 className="text-success"><i className="bi bi-info-square me-2"></i>Giới thiệu</h6>
                        <p>{product.thong_tin_chi_tiet.gioi_thieu}</p>
                      </div>
                    </div>
                  )}
                  {product.thong_tin_chi_tiet.dac_diem && (
                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded h-100">
                        <h6 className="text-success"><i className="bi bi-stars me-2"></i>Đặc điểm</h6>
                        <p>{product.thong_tin_chi_tiet.dac_diem}</p>
                      </div>
                    </div>
                  )}
                  {product.thong_tin_chi_tiet.cong_dung_y_nghia && (
                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded h-100">
                        <h6 className="text-success"><i className="bi bi-lightbulb me-2"></i>Công dụng & Ý nghĩa</h6>
                        <p>{product.thong_tin_chi_tiet.cong_dung_y_nghia}</p>
                      </div>
                    </div>
                  )}
                  {product.thong_tin_chi_tiet.cach_cham_soc && (
                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded h-100">
                        <h6 className="text-success"><i className="bi bi-flower1 me-2"></i>Cách chăm sóc</h6>
                        <p>{product.thong_tin_chi_tiet.cach_cham_soc}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sản phẩm liên quan */}
      {relatedProducts.length > 0 && (
        <div className="mt-5 pt-4 border-top">
          <h3 className="mb-4">
            <i className="bi bi-link-45deg me-2"></i>Sản phẩm liên quan
          </h3>
          <Slider {...sliderSettings}>
            {relatedProducts.map(rp => (
              <div key={rp.ma_san_pham} className="px-2">
               <div className="card h-100 border-0 shadow-sm product-card">
                <Link to={`/san-pham/${rp.ma_san_pham}`} className="text-decoration-none">
                  <div className="ratio ratio-1x1 image-wrapper">
                    <img
                      src={`http://127.0.0.1:8000/images/${rp.hinh_san_pham}.jpg`}
                      className="card-img-top object-fit-contain bg-light product-img"
                      alt={rp.ten_san_pham}
                      onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder.jpg'; }}
                      loading="lazy"
                      style={{ transition: 'opacity 0.3s ease', opacity: 0 }}
                      onLoad={(e) => { e.target.style.opacity = 1; }}
                    />
                    <div className="product-overlay">
                      <h6>{rp.ten_san_pham}</h6>
                      <p>{Number(rp.gia_san_pham).toLocaleString('vi-VN')}đ</p>
                    </div>
                  </div>
                </Link>
              </div>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default ThongTinSanPham;