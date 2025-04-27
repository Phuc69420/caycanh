import React, { useState } from "react";

const OrdersManagement = ({ orders }) => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [localOrders, setLocalOrders] = useState(orders || []);
  
  // Filter orders based on status
  const filteredOrders = statusFilter === "all" 
    ? localOrders 
    : localOrders.filter(order => order.trang_thai === statusFilter);
  
  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/api/donhang/${orderId}/trangthai`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Nếu cần auth thì thêm Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ trang_thai: newStatus }),
      });
  
      const result = await response.json();
  
      if (result.success) {
        const updatedOrders = localOrders.map(order =>
          order.ma_don_hang === orderId ? { ...order, trang_thai: newStatus } : order
        );
        setLocalOrders(updatedOrders);
      } else {
        alert("❌ Cập nhật thất bại");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Có lỗi xảy ra khi cập nhật");
    }
  };
  

  return (
    <div className="admin-orders">
      <div className="d-flex justify-content-between mb-3">
        <div className="btn-group">
          <button 
            className={`btn ${statusFilter === "all" ? "btn-success" : "btn-outline-success"}`}
            onClick={() => setStatusFilter("all")}
          >
            Tất Cả
          </button>
          <button 
            className={`btn ${statusFilter === "Đang xử lý" ? "btn-success" : "btn-outline-success"}`}
            onClick={() => setStatusFilter("Đang xử lý")}
          >
            Đang Xử Lý
          </button>
          <button 
            className={`btn ${statusFilter === "Chuẩn bị đơn hàng" ? "btn-success" : "btn-outline-success"}`}
            onClick={() => setStatusFilter("Chuẩn bị đơn hàng")}
          >
            Chuẩn bị đơn hàng
          </button>
          <button 
            className={`btn ${statusFilter === "Đang vận chuyển" ? "btn-success" : "btn-outline-success"}`}
            onClick={() => setStatusFilter("Đang vận chuyển")}
          >
            Đang Vận Chuyển
          </button>
          <button 
            className={`btn ${statusFilter === "Đã giao" ? "btn-success" : "btn-outline-success"}`}
            onClick={() => setStatusFilter("Đã giao")}
          >
            Đã Giao
          </button>
        </div>
        
        <div className="input-group w-25">
          <input
            type="search"
            className="form-control"
            placeholder="Tìm kiếm đơn hàng..."
          />
          <button className="btn btn-outline-secondary" type="button">
            <i className="bi bi-search"></i>
          </button>
        </div>
      </div>
      
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
        <thead className="table-success">
          <tr>
            <th>Mã ĐH</th>
            <th>Khách Hàng</th>
            <th>SĐT</th>
            <th>Email</th>
            <th>Địa Chỉ</th>
            <th>Phương Thức</th>
            <th>Ngày Đặt</th>
            <th>Tổng Tiền</th>
            <th>Trạng Thái</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <tr key={order.ma_don_hang}>
              <td>{order.ma_don_hang}</td>
              <td>{order.ten_khach_hang}</td>
              <td>{order.sdt_kh}</td>
              <td>{order.email_kh}</td>
              <td>{order.dia_chi_giao_hang}</td>
              <td>{order.phuong_thuc_thanh_toan}</td>
              <td>{order.ngay_dat}</td>
              <td>{Number(order.tong_tien).toLocaleString("vi-VN")}đ</td>
              <td>
                <span className={`badge ${
                  order.trang_thai === "Đã giao" ? "bg-success" :
                  order.trang_thai === "Đang xử lý" ? "bg-warning" :
                  "bg-info"
                }`}>
                  {order.trang_thai}
                </span>
              </td>
              <td>
                <div className="dropdown">
                  <button className="btn btn-sm btn-secondary dropdown-toggle" type="button" id={`dropdownOrder${order.ma_don_hang}`} data-bs-toggle="dropdown" aria-expanded="false">
                    Cập nhật
                  </button>
                  <ul className="dropdown-menu" aria-labelledby={`dropdownOrder${order.ma_don_hang}`}>
                    <li><button className="dropdown-item" onClick={() => updateOrderStatus(order.ma_don_hang, "Đang xử lý")}>Đang xử lý</button></li>
                    <li><button className="dropdown-item" onClick={() => updateOrderStatus(order.ma_don_hang, "Chuẩn bị đơn hàng")}>Chuẩn bị đơn hàng</button></li>
                    <li><button className="dropdown-item" onClick={() => updateOrderStatus(order.ma_don_hang, "Đang vận chuyển")}>Đang vận chuyển</button></li>
                    <li><button className="dropdown-item" onClick={() => updateOrderStatus(order.ma_don_hang, "Đã giao")}>Đã giao</button></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-danger">Hủy đơn</button></li>
                  </ul>
                </div>
              </td>
            </tr>
          ))}
        </tbody>

        </table>
      </div>
      
      {filteredOrders.length === 0 && (
        <div className="text-center py-4">
          <p className="text-muted">Không có đơn hàng nào trong trạng thái này</p>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
