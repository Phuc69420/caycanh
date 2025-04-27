import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const GioiThieu = () => {
  return (
    <div className="container mt-4 mb-5">
      <div className="row">
        <div className="col-md-9">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Trang chủ</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Giới thiệu
              </li>
            </ol>
          </nav>

          <h2 className="text-success fw-bold mb-4">GIỚI THIỆU VỀ THẾ GIỚI CÂY CẢNH</h2>

          <div className="intro-content">
            <img 
              src="/images/gioi-thieu.jpg" 
              alt="Thế giới cây cảnh" 
              className="img-fluid rounded mb-4 w-100" 
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />

            <h4 className="text-success fw-bold mb-3">Chào mừng quý khách đến với "Thế giới cây cảnh"!</h4>
            
            <p className="mb-4">
              Được thành lập vào năm 2020, <strong>Thế Giới Cây Cảnh</strong> tự hào là địa chỉ uy tín chuyên cung cấp các loại cây cảnh, 
              cây kiểng đẹp, chất lượng cao và đa dạng phong cách. Cửa hàng chúng tôi mang đến cho khách hàng một không gian 
              xanh tươi, mát mẻ với nhiều lựa chọn phong phú từ cây để bàn, cây sen đá, xương rồng mini đến các loại cây bonsai 
              độc đáo.
            </p>

            <h5 className="text-success fw-bold mb-3">Sứ mệnh của chúng tôi</h5>
            <p className="mb-4">
              Thế Giới Cây Cảnh ra đời với sứ mệnh mang thiên nhiên xanh đến gần hơn với cuộc sống đô thị, 
              giúp mọi người có thể tận hưởng không gian sống trong lành, tươi mát và tràn đầy năng lượng tích cực. 
              Chúng tôi không chỉ bán cây cảnh mà còn chia sẻ niềm đam mê, kiến thức và kỹ năng chăm sóc để mỗi khách hàng 
              đều có thể trở thành "nhà làm vườn" thành công.
            </p>

            <h5 className="text-success fw-bold mb-3">Sản phẩm đa dạng</h5>
            <p className="mb-4">
              Thế Giới Cây Cảnh cung cấp đa dạng các dòng sản phẩm:
            </p>
            <ul className="mb-4">
              <li>Cây cảnh để bàn: Sen đá, xương rồng mini, cây thủy sinh...</li>
              <li>Cây cảnh văn phòng: Trầu bà, kim ngân, phát tài...</li>
              <li>Cây bonsai: Mai chiếu thủy, tùng la hán, cần thăng...</li>
              <li>Phụ kiện làm vườn: Chậu cảnh, đất trồng, phân bón, dụng cụ làm vườn...</li>
              <li>Dịch vụ tư vấn thiết kế, chăm sóc cây cảnh</li>
            </ul>

            <h5 className="text-success fw-bold mb-3">Cam kết chất lượng</h5>
            <p className="mb-4">
              Tại Thế Giới Cây Cảnh, chúng tôi cam kết:
            </p>
            <ul className="mb-4">
              <li>Cung cấp cây cảnh chất lượng, khỏe mạnh từ các nguồn uy tín</li>
              <li>Tư vấn tận tâm, hỗ trợ khách hàng từ lúc chọn mua đến chăm sóc cây</li>
              <li>Giao hàng nhanh chóng, đóng gói cẩn thận đảm bảo cây không bị hư hại</li>
              <li>Chế độ bảo hành rõ ràng, hỗ trợ sau bán hàng chu đáo</li>
              <li>Giá cả hợp lý, cạnh tranh trên thị trường</li>
            </ul>

            <h5 className="text-success fw-bold mb-3">Đội ngũ chuyên nghiệp</h5>
            <p className="mb-4">
              Đội ngũ nhân viên của Thế Giới Cây Cảnh là những người trẻ đầy nhiệt huyết, am hiểu và yêu thích cây cảnh. 
              Chúng tôi luôn không ngừng học hỏi, trau dồi kiến thức và kỹ năng để mang đến cho khách hàng những sản phẩm 
              tốt nhất cùng dịch vụ chuyên nghiệp, tận tâm.
            </p>

            <h5 className="text-success fw-bold mb-3">Thông tin liên hệ</h5>
            <ul className="mb-4 list-unstyled ps-0">
              <li><i className="bi bi-geo-alt-fill text-success me-2"></i>Địa chỉ: 123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</li>
              <li><i className="bi bi-telephone-fill text-success me-2"></i>Hotline: 0909 123 456</li>
              <li><i className="bi bi-envelope-fill text-success me-2"></i>Email: info@thegioicaycanh.com</li>
              <li><i className="bi bi-clock-fill text-success me-2"></i>Giờ mở cửa: 8:00 - 21:00 (Tất cả các ngày trong tuần)</li>
            </ul>

            <div className="text-center mb-4">
              <img 
                src="/images/store-photo.jpg" 
                alt="Cửa hàng Thế giới cây cảnh" 
                className="img-fluid rounded" 
                style={{ maxHeight: "350px", objectFit: "cover" }}
              />
            </div>

            <p className="fw-bold text-success text-center fs-5 mb-5">
              Hãy đến với Thế Giới Cây Cảnh, nơi mỗi cây xanh là một tác phẩm nghệ thuật sống động!
            </p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Danh mục sản phẩm</h5>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Cây Để Bàn</li>
              <li className="list-group-item">Cây Sen Đá</li>
              <li className="list-group-item">Cây Xương Rồng</li>
              <li className="list-group-item">Cây Bonsai</li>
              <li className="list-group-item">Chậu Cây</li>
              <li className="list-group-item">Đất Trồng Cây</li>
            </ul>
          </div>

          <div className="card mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Bài viết nổi bật</h5>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">5 cây cảnh dễ chăm sóc cho người bận rộn</li>
              <li className="list-group-item">Cách chăm sóc sen đá đúng cách cho người mới bắt đầu</li>
              <li className="list-group-item">Những loại cây lọc không khí hiệu quả trong nhà</li>
              <li className="list-group-item">Cách bón phân cho cây cảnh đúng kỹ thuật</li>
            </ul>
          </div>

          <div className="card">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Kết nối với chúng tôi</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-around fs-3 mb-3">
                <i className="bi bi-facebook text-primary"></i>
                <i className="bi bi-instagram text-danger"></i>
                <i className="bi bi-youtube text-danger"></i>
                <i className="bi bi-tiktok"></i>
              </div>
              <div className="input-group">
                <input type="email" className="form-control" placeholder="Email của bạn..." />
                <button className="btn btn-success">Đăng ký</button>
              </div>
              <small className="text-muted mt-2 d-block">Đăng ký để nhận thông tin khuyến mãi mới nhất</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GioiThieu;