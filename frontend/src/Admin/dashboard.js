import React from "react";

const Dashboard = ({ products, categories, orders }) => {
  // Calculate pending questions count - no longer needed as we removed the feature
  // const pendingQuestions = questions.filter(q => q.trang_thai === "Chưa trả lời").length;

  return (
    <div className="admin-dashboard">
      <div className="row">
        <div className="col-md-4">
          <div className="dashboard-card bg-primary">
            <div className="dashboard-card-icon">
              <i className="bi bi-box-seam"></i>
            </div>
            <div className="dashboard-card-content">
              <h3>{products.length}</h3>
              <p>Sản Phẩm</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="dashboard-card bg-success">
            <div className="dashboard-card-icon">
              <i className="bi bi-tags"></i>
            </div>
            <div className="dashboard-card-content">
              <h3>{categories.length || 6}</h3>
              <p>Danh Mục</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="dashboard-card bg-warning">
            <div className="dashboard-card-icon">
              <i className="bi bi-cart-check"></i>
            </div>
            <div className="dashboard-card-content">
              <h3>{orders.length}</h3>
              <p>Đơn Hàng</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header bg-light">
              <h5>Đơn Hàng Gần Đây</h5>
            </div>
            <div className="card-body">
              <table className="table table-striped">
                <thead>
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
                  {orders.map(order => (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
