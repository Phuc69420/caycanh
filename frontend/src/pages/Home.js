import React, { useState, useEffect } from 'react';
import axios from 'axios'; // dùng để gọi API

function Home() {
  const [plants, setPlants] = useState([]);

  // Giả sử API Laravel của bạn có endpoint: http://127.0.0.1:8000/api/plants
  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/plants')
      .then((response) => {
        setPlants(response.data);
      })
      .catch((error) => {
        console.error('Lỗi khi fetch dữ liệu:', error);
      });
  }, []);

  return (
    <div>
      {/* Header */}
      <header className="bg-success text-white p-3">
        <div className="container">
          <h1>Shop Cây Cảnh</h1>
        </div>
      </header>

      {/* Banner */}
      <section className="bg-light py-5">
        <div className="container">
          <h2 className="mb-4">Chào mừng bạn đến với thế giới cây xanh</h2>
          <p>
            Website bán cây cảnh, cung cấp đa dạng các loại cây xanh giúp trang
            trí nhà cửa, văn phòng và khu vườn của bạn.
          </p>
          <button className="btn btn-success mt-3">Mua ngay</button>
        </div>
      </section>

      {/* Danh sách sản phẩm */}
      <section className="py-5">
        <div className="container">
          <h2 className="mb-4">Danh sách cây cảnh</h2>
          <div className="row">
            {plants.map((plant) => (
              <div className="col-md-3 mb-4" key={plant.id}>
                <div className="card h-100">
                  {/* Giả sử có cột 'image_url' chứa link ảnh */}
                  <img
                    src={plant.image_url}
                    className="card-img-top"
                    alt={plant.ten_san_pham}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{plant.ten_san_pham}</h5>
                    <p className="card-text">Giá: {plant.gia_san_pham} VND</p>
                    <button className="btn btn-outline-success">
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-success text-white py-4">
        <div className="container text-center">
          <p>© 2023 Shop Cây Cảnh. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
