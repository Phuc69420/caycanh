// src/Admin/ProductsManagement.jsx
import React, { useState, useMemo } from "react";
import axios from "axios";
import ProductModal from "./ProductModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductsManagement = ({ products, setProducts, categories }) => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    ma_san_pham: "",
    ten_san_pham: "",
    gia_san_pham: 0,
    mo_ta_san_pham: "",
    so_luong: 0,
    ma_danh_muc: "",
    hinh_san_pham: "",
    hinh_file: null
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const filteredProducts = useMemo(
    () =>
      products.filter(p =>
        typeof p.ten_san_pham === "string" &&
        p.ten_san_pham.toLowerCase().includes(searchTerm.trim().toLowerCase())
      ),
    [products, searchTerm]
  );

  const deleteProduct = async (productId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    try {
      setActionLoadingId(productId);
      await axios.delete(`http://127.0.0.1:8000/api/sanpham/${productId}`);
      setProducts(prev => prev.filter(p => p.ma_san_pham !== productId));
      toast.success(" Xóa sản phẩm thành công!");
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Lỗi khi xóa sản phẩm");
    } finally {
      setActionLoadingId(null);
    }
  };

  const saveProduct = async (productData) => {
    const isEdit = Boolean(editingProduct);
    const formData = new FormData();

    formData.append("ma_san_pham", productData.ma_san_pham);
    formData.append("ten_san_pham", productData.ten_san_pham);
    formData.append("gia_san_pham", productData.gia_san_pham);
    formData.append("mo_ta", productData.mo_ta_san_pham);
    formData.append("so_luong", productData.so_luong);
    formData.append("ma_danh_muc", productData.ma_danh_muc);
    if (productData.hinh_file) {
      formData.append("hinh_anh", productData.hinh_file);
    }

    try {
      setActionLoadingId(productData.ma_san_pham || "new");
      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (isEdit) {
        await axios.post(
          `http://127.0.0.1:8000/api/sanpham/${productData.ma_san_pham}?_method=PUT`,
          formData,
          config
        );
        setProducts(prev =>
          prev.map(p =>
            p.ma_san_pham === productData.ma_san_pham
              ? {
                  ...p,
                  ...productData,
                  hinh_san_pham: productData.hinh_file
                    ? productData.hinh_file.name.replace(/\.[^/.]+$/, "")
                    : p.hinh_san_pham
                }
              : p
          )
        );
        toast.success("✅ Cập nhật sản phẩm thành công!");
      } else {
        const res = await axios.post(
          "http://127.0.0.1:8000/api/sanpham",
          formData,
          config
        );
        setProducts(prev => [...prev, res.data.san_pham]);
        toast.success("🎉 Thêm sản phẩm thành công!");
      }

      setShowModal(false);
      setEditingProduct(null);
      setNewProduct({
        ma_san_pham: "",
        ten_san_pham: "",
        gia_san_pham: 0,
        mo_ta_san_pham: "",
        so_luong: 0,
        ma_danh_muc: "",
        hinh_san_pham: "",
        hinh_file: null
      });
    } catch (err) {
      console.error(`Error ${isEdit ? "updating" : "adding"} product:`, err);
      if (err.response?.status === 409) {
        toast.error("⚠️ Mã sản phẩm đã tồn tại!");
      } else {
        toast.error(`❌ Lỗi khi ${isEdit ? "cập nhật" : "thêm"} sản phẩm`);
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const openModalForNew = () => {
    setEditingProduct(null);
    setNewProduct({
      ma_san_pham: "",
      ten_san_pham: "",
      gia_san_pham: 0,
      mo_ta_san_pham: "",
      so_luong: 0,
      ma_danh_muc: "",
      hinh_san_pham: "",
      hinh_file: null
    });
    setShowModal(true);
  };

  return (
    <div className="admin-products">
      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-success" onClick={openModalForNew}>
          <i className="bi bi-plus-circle" /> Thêm Sản Phẩm
        </button>
        <input
          type="search"
          className="form-control w-25"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-success">
            <tr>
              <th>Mã SP</th>
              <th>Hình Ảnh</th>
              <th>Tên Sản Phẩm</th>
              <th>Giá</th>
              <th>Danh Mục</th>
              <th>Số Lượng</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.ma_san_pham}>
                <td>{product.ma_san_pham}</td>
                <td>
                  <img
                    src={`http://127.0.0.1:8000/images/${product.hinh_san_pham.includes('.') ? product.hinh_san_pham : product.hinh_san_pham + '.jpg'}`}
                    alt={product.ten_san_pham}
                    className="admin-product-img"
                  />
                </td>
                <td>{product.ten_san_pham}</td>
                <td>{Number(product.gia_san_pham).toLocaleString("vi-VN")}đ</td>
                <td>{product.ten_danh_muc}</td>
                <td>{product.so_luong}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-1"
                    disabled={actionLoadingId === product.ma_san_pham}
                    onClick={() => {
                      setEditingProduct(product);
                      setShowModal(true);
                    }}
                  >
                    <i className="bi bi-pencil" />
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    disabled={actionLoadingId === product.ma_san_pham}
                    onClick={() => deleteProduct(product.ma_san_pham)}
                  >
                    <i className="bi bi-trash" />
                  </button>
                </td>
              </tr>
            ))}
            {!filteredProducts.length && (
              <tr>
                <td colSpan="7" className="text-center">
                  Không tìm thấy sản phẩm nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ProductModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        editingProduct={editingProduct}
        newProduct={newProduct}
        saveProduct={saveProduct}
        categories={categories}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
      />
    </div>
  );
};

export default ProductsManagement;
