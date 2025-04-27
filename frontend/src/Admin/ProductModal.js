// src/Admin/ProductModal.jsx
import React, { useState, useEffect } from "react";

const ProductModal = ({
  show,
  handleClose,
  editingProduct,
  newProduct,
  saveProduct,
  categories
}) => {
  const [productData, setProductData] = useState(editingProduct || newProduct);

  useEffect(() => {
    setProductData(editingProduct || newProduct);
  }, [editingProduct, newProduct, show]);

  const handleProductChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "hinh_file") {
      setProductData({ ...productData, [name]: files[0] });
    } else {
      setProductData({ ...productData, [name]: value });
    }
  };

  const handleSubmit = () => {
    saveProduct(productData);
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {editingProduct ? "Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
            </h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <form>
              {/* Mã sản phẩm */}
              <div className="mb-3">
                <label className="form-label">Mã Sản Phẩm</label>
                <input
                  type="text"
                  className="form-control"
                  name="ma_san_pham"
                  value={productData.ma_san_pham}
                  onChange={handleProductChange}
                  required={!editingProduct}
                  disabled={!!editingProduct}
                />
              </div>

              {/* Tên và giá */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Tên Sản Phẩm</label>
                  <input
                    type="text"
                    className="form-control"
                    name="ten_san_pham"
                    value={productData.ten_san_pham}
                    onChange={handleProductChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Giá Sản Phẩm</label>
                  <input
                    type="number"
                    className="form-control"
                    name="gia_san_pham"
                    value={productData.gia_san_pham}
                    onChange={handleProductChange}
                    required
                  />
                </div>
              </div>

              {/* Danh mục và số lượng */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Danh Mục</label>
                  <select
                    className="form-control"
                    name="ma_danh_muc"
                    value={productData.ma_danh_muc}
                    onChange={handleProductChange}
                    required
                  >
                    <option value="">-- Chọn Danh Mục --</option>
                    {categories.map(cat => (
                      <option key={cat.ma_danh_muc} value={cat.ma_danh_muc}>
                        {cat.ten_danh_muc}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Số Lượng</label>
                  <input
                    type="number"
                    className="form-control"
                    name="so_luong"
                    value={productData.so_luong}
                    onChange={handleProductChange}
                    required
                  />
                </div>
              </div>

              {/* Hình ảnh */}
              <div className="mb-3">
                <label className="form-label">Hình Ảnh</label>
                <input
                  type="file"
                  className="form-control"
                  name="hinh_file"
                  accept="image/*"
                  onChange={handleProductChange}
                />
                {editingProduct && !productData.hinh_file && (
                  <small className="text-muted">
                    Ảnh hiện tại: <strong>{editingProduct.hinh_san_pham}.jpg</strong>
                  </small>
                )}
              </div>

              {/* Mô tả */}
              <div className="mb-3">
                <label className="form-label">Mô Tả Sản Phẩm</label>
                <textarea
                  className="form-control"
                  name="mo_ta_san_pham"
                  rows="4"
                  value={productData.mo_ta_san_pham}
                  onChange={handleProductChange}
                ></textarea>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={handleClose}>
              Đóng
            </button>
            <button className="btn btn-success" onClick={handleSubmit}>
              {editingProduct ? "Cập Nhật" : "Thêm Mới"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
