import React from "react";

const Sidebar = ({ activeTab, setActiveTab, handleLogout }) => {
  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h3>Quản Trị Viên</h3>
        <p>Thế Giới Cây Cảnh</p>
      </div>
      
      <div className="admin-sidebar-menu">
        <div 
          className={`admin-sidebar-item ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          <i className="bi bi-speedometer2"></i> Tổng Quan
        </div>
        
        <div 
          className={`admin-sidebar-item ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          <i className="bi bi-box-seam"></i> Sản Phẩm
        </div>
        
        <div 
          className={`admin-sidebar-item ${activeTab === "categories" ? "active" : ""}`}
          onClick={() => setActiveTab("categories")}
        >
          <i className="bi bi-tags"></i> Danh Mục
        </div>
        
        <div 
          className={`admin-sidebar-item ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          <i className="bi bi-cart-check"></i> Đơn Hàng
        </div>
        <div 
          className={`admin-sidebar-item ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          <i className="bi bi-people"></i>
          <span>Người Dùng</span>
        </div>
      </div>
      
      <div className="admin-sidebar-footer">
        <button className="btn btn-outline-light w-100" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right"></i> Đăng Xuất
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
