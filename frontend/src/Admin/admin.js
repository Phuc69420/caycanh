// ... các import giữ nguyên
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./admin.css";

// Import các component con cùng thư mục src/Admin
import Dashboard from "./dashboard";
import ProductsManagement from "./productsmanagement";
import CategoriesManagement from "./categoriesmanagement";
import OrdersManagement from "./ordersmanagement";
import LoginForm from "./loginform";
import Sidebar from "./sidebar";
import UsersManagement from "./UsersManagement";


const Admin = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedAuth = localStorage.getItem("adminAuthenticated");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }

    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
      const interval = setInterval(fetchAllData, 30000); // Cập nhật mỗi 30 giây
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchAllData = () => {
    setLoading(true);

    // Fetch products
    axios.get("http://127.0.0.1:8000/api/sanpham")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });

    // Fetch categories
    axios.get("http://127.0.0.1:8000/api/sanpham/danhmuc")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });

    // Fetch orders with field mapping
    axios.get("http://127.0.0.1:8000/api/donhang")
      .then((res) => {
        const mappedOrders = res.data.map((order) => ({
          ma_don_hang: order.ma_don_hang,
          ten_khach_hang: order.ten_khach_hang,
          sdt_kh: order.sdt_kh,
          email_kh: order.email_kh,
          dia_chi_giao_hang: order.dia_chi_giao_hang,
          phuong_thuc_thanh_toan: order.phuong_thuc_thanh_toan,
          tong_tien: order.tong_so_tien,
          ngay_dat: order.ngay_dat_hang,
          trang_thai: order.trang_thai,
        }));
        setOrders(mappedOrders);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
      });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminAuthenticated");
  };

  if (!isAuthenticated) {
    return (
      <LoginForm 
        setIsAuthenticated={setIsAuthenticated}
        loading={loading}
        setLoading={setLoading}
      />
    );
  }

  return (
    <div className="admin-container">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        handleLogout={handleLogout} 
      />

      <div className="admin-content">
        <div className="admin-header">
          <h2>
            {activeTab === "dashboard" && "Tổng Quan"}
            {activeTab === "products" && "Quản Lý Sản Phẩm"}
            {activeTab === "categories" && "Quản Lý Danh Mục"}
            {activeTab === "orders" && "Quản Lý Đơn Hàng"}
            {activeTab === "users" && "Quản Lý Người Dùng"}
          </h2>
          <div className="admin-user-info">
            <span>Admin</span>
            <img src="/logo/logo.jpg" alt="Admin" className="admin-avatar" />
          </div>
        </div>

        {activeTab === "dashboard" && (
          <Dashboard 
            products={products} 
            categories={categories} 
            orders={orders} 
          />
        )}

        {activeTab === "products" && (
          <ProductsManagement 
            products={products} 
            setProducts={setProducts} 
            categories={categories} 
          />
        )}

        {activeTab === "categories" && (
          <CategoriesManagement 
            categories={categories} 
            products={products} 
          />
        )}

        {activeTab === "orders" && (
          <OrdersManagement orders={orders} />
        )}
      </div>
    </div>
  );
};

export default Admin;
