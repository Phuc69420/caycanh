import React from 'react';
import { Link } from 'react-router-dom';

const TinTuc = () => {
  const tinTucData = [
    {
      id: 1,
      title: "5 cây cảnh dễ chăm sóc cho người bận rộn",
      image: "/images/news/tin1.jpg",
      summary: "Khám phá những loại cây cảnh thích hợp cho người bận rộn, có khả năng thích nghi cao và không cần chăm sóc nhiều...",
      date: "10/04/2024",
      category: "Chăm sóc cây",
      author: "Admin"
    },
    {
      id: 2,
      title: "Cách chăm sóc sen đá đúng cách cho người mới bắt đầu",
      image: "/images/news/tin2.jpg",
      summary: "Hướng dẫn chi tiết cách chăm sóc sen đá từ A-Z dành cho những người mới bắt đầu trồng cây...",
      date: "09/04/2024",
      category: "Sen đá",
      author: "Admin"
    },
    {
      id: 3,
      title: "Những loại cây lọc không khí hiệu quả trong nhà",
      image: "/images/news/tin3.jpg",
      summary: "Top những loại cây cảnh có khả năng lọc không khí, mang lại không gian sống trong lành cho gia đình bạn...",
      date: "08/04/2024",
      category: "Cây trong nhà",
      author: "Admin"
    },
    {
      id: 4,
      title: "Cách bón phân cho cây cảnh đúng kỹ thuật",
      image: "/images/news/tin4.jpg",
      summary: "Hướng dẫn chi tiết về cách bón phân, thời điểm bón phân và lựa chọn loại phân phù hợp cho từng loại cây cảnh...",
      date: "07/04/2024",
      category: "Kỹ thuật trồng",
      author: "Admin"
    },
    {
      id: 5,
      title: "Top 10 cây cảnh phong thủy hợp với từng không gian",
      image: "/images/news/tin5.jpg",
      summary: "Gợi ý những loại cây cảnh phong thủy phù hợp với từng không gian sống, mang lại may mắn và tài lộc...",
      date: "06/04/2024",
      category: "Phong thủy",
      author: "Admin"
    }
  ];

  return (
    <div className="container mt-4 tin-tuc-page">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Trang chủ</Link>
          </li>
          <li className="breadcrumb-item active">Tin tức</li>
        </ol>
      </nav>

      <h2 className="text-success mb-4">Tin tức & Bài viết</h2>

      <div className="row">
        <div className="col-md-8">
          {tinTucData.map((post) => (
            <div key={post.id} className="card mb-4">
              <div className="row g-0">
                <div className="col-md-4">
                  <img
                    src={post.image}
                    className="img-fluid rounded-start h-100"
                    alt={post.title}
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title text-success">{post.title}</h5>
                    <p className="card-text">{post.summary}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        <i className="bi bi-calendar3"></i> {post.date} |{" "}
                        <i className="bi bi-folder2"></i> {post.category} |{" "}
                        <i className="bi bi-person"></i> {post.author}
                      </small>
                      <Link to={`/tin-tuc/${post.id}`} className="btn btn-outline-success btn-sm">
                        Đọc thêm
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Danh mục</h5>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Chăm sóc cây
                <span className="badge bg-success rounded-pill">14</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Sen đá
                <span className="badge bg-success rounded-pill">8</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Cây trong nhà
                <span className="badge bg-success rounded-pill">10</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Kỹ thuật trồng
                <span className="badge bg-success rounded-pill">12</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Phong thủy
                <span className="badge bg-success rounded-pill">6</span>
              </li>
            </ul>
          </div>

          <div className="card">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Bài viết nổi bật</h5>
            </div>
            <ul className="list-group list-group-flush">
              {tinTucData.slice(0, 4).map((post) => (
                <li key={post.id} className="list-group-item">
                  <Link to={`/tin-tuc/${post.id}`} className="text-decoration-none">
                    <div className="d-flex align-items-center">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="me-2" 
                        style={{width: "50px", height: "50px", objectFit: "cover"}}
                      />
                      <small className="text-muted">{post.title}</small>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TinTuc;