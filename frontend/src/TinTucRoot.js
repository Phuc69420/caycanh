import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const TinTuc = () => {
  const tinTucList = [
    {
      id: 1,
      title: "Cây Lưỡi Hổ Thái - Đặc điểm, Công dụng, Cách trồng và Chăm sóc",
      description: "Cây Lưỡi Hổ Thái mang ý nghĩa phong thủy và có tác dụng thanh lọc không khí.",
      image: "/images/cay-luoi-ho-thai.jpg",
      link: "/LuoiHothai.html",
    },
    {
      id: 2,
      title: "Cây Lữ Hổ Xanh - Cây Cảnh Đẹp Trong Nhà",
      description: "Cây Lữ Hổ Xanh là một lựa chọn tuyệt vời để trang trí không gian sống.",
      image: "/images/cay-lu-ho-xanh.jpg",
      link: "/LuHoXanh.html",
    },
    {
      id: 3,
      title: "Cây Bạch Mã Hoàng Tử - Sự Thanh Lịch Trong Cây Cảnh",
      description: "Cây Bạch Mã Hoàng Tử tượng trưng cho sự thanh lịch và mang lại may mắn.",
      image: "/images/cay-bach-ma-hoang-tu.jpg",
      link: "/BachMaHoangTu.html",
    },
    {
      id: 4,
      title: "Cây Xương Rồng Thanh Sơn - Cây Cảnh Độc Đáo",
      description: "Loài cây xương rồng với hình dáng độc đáo, thích hợp để trang trí bàn làm việc.",
      image: "/images/cay-xuong-rong-thanh-son.jpg",
      link: "/XuongRongThanhSon.html",
    },
    {
      id: 5,
      title: "Cây Xương Rồng Tai Thỏ - Đáng Yêu Và Dễ Chăm Sóc",
      description: "Xương rồng tai thỏ là lựa chọn lý tưởng cho những người yêu cây cảnh dễ chăm sóc.",
      image: "/images/cay-xuong-rong-tai-tho.jpg",
      link: "/XuongRongTaiTho.html",
    },
    {
      id: 6,
      title: "Cây Thông Đen Nhật Bản - Vẻ Đẹp Của Thiên Nhiên",
      description: "Cây Thông Đen Nhật Bản mang vẻ đẹp cổ kính, thích hợp làm cây bonsai.",
      image: "/images/cay-thong-den-nhat-ban.jpg",
      link: "/CayThongDenNhatBan.html",
    },
    {
      id: 7,
      title: "Cây Linh Sam - Cây Bonsai Nghệ Thuật",
      description: "Cây Linh Sam được nhiều người yêu thích vì hình dáng nghệ thuật của nó.",
      image: "/images/cay-linh-sam.jpg",
      link: "/CayLinhSam.html",
    },
    {
      id: 8,
      title: "Sen Đá Phật Bà - Ý Nghĩa Phong Thủy",
      description: "Sen Đá Phật Bà mang đến may mắn và tài lộc cho người trồng.",
      image: "/images/sen-da-phat-ba.jpg",
      link: "/SenDaPhatBa.html",
    },
    {
      id: 9,
      title: "Sen Đá Viền Đỏ - Loại Cây Trang Trí Độc Đáo",
      description: "Sen Đá Viền Đỏ nổi bật với màu sắc đặc trưng và dễ chăm sóc.",
      image: "/images/sen-da-vien-do.jpg",
      link: "/SenDaVienDo.html",
    },
  ];

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
                Tin tức
              </li>
            </ol>
          </nav>

          <h2 className="text-success fw-bold mb-4">TIN TỨC CÂY CẢNH</h2>

          <div className="row">
            {tinTucList.map((tin) => (
              <div className="col-md-6 mb-4" key={tin.id}>
                <div className="card h-100">
                  <img
                    src={tin.image}
                    alt={tin.title}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title text-success">{tin.title}</h5>
                    <p className="card-text">{tin.description}</p>
                    <button 
                        className="btn btn-success"
                        onClick={() => window.location.href = tin.link}
                        >
                        Xem chi tiết
                    </button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-3">
          <div className="card mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Tin nổi bật</h5>
            </div>
            <ul className="list-group list-group-flush">
              {tinTucList.slice(0, 3).map((tin) => (
                <li className="list-group-item" key={tin.id}>{tin.title}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TinTuc;