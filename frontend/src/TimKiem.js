import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Card, Spinner, Alert, Container, Row, Col } from "react-bootstrap";

const TimKiem = () => {
  const [ketQua, setKetQua] = useState([]);
  const [dangTai, setDangTai] = useState(false);
  const [loi, setLoi] = useState(null);
  const [searchParams] = useSearchParams();
  const tuKhoa = searchParams.get("q") || "";
  const navigate = useNavigate();

  // Hàm tìm kiếm sản phẩm
  const timKiemSanPham = async (keyword) => {
    try {
      setDangTai(true);
      setLoi(null);

      const response = await axios.get(
        `http://127.0.0.1:8000/api/search-san-pham?q=${encodeURIComponent(keyword)}`
      );

      if (response.data && Array.isArray(response.data.data)) {
        const results = response.data.data;

        // Lọc kết quả chứa tất cả từ khóa trong tên sản phẩm
        const keywords = keyword.toLowerCase().split(" ");
        const ketQuaPhuHop = results.filter(sp =>
          keywords.every(kw => sp.ten_san_pham.toLowerCase().includes(kw))
        );

        setKetQua(ketQuaPhuHop);

        // Nếu chỉ có 1 sản phẩm phù hợp thì điều hướng đến trang chi tiết
        if (ketQuaPhuHop.length === 1) {
          const maSP = ketQuaPhuHop[0].ma_san_pham;
          navigate(`/san-pham/${maSP}`);
        }
      } else {
        setKetQua([]);
        setLoi("Dữ liệu trả về không hợp lệ");
        console.error("Dữ liệu không phải mảng:", response.data);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      setLoi(error.response?.data?.message || "Lỗi khi tải kết quả tìm kiếm");
      setKetQua([]);
    } finally {
      setDangTai(false);
    }
  };

  // Gọi API khi từ khóa thay đổi
  useEffect(() => {
    if (tuKhoa.trim()) {
      timKiemSanPham(tuKhoa);
    } else {
      setKetQua([]);
    }
  }, [tuKhoa]);

  // Hiển thị loading
  if (dangTai) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-2">Đang tìm kiếm sản phẩm...</p>
      </Container>
    );
  }

  // Hiển thị lỗi
  if (loi) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          <Alert.Heading>Đã xảy ra lỗi</Alert.Heading>
          <p>{loi}</p>
        </Alert>
      </Container>
    );
  }

  // Giao diện kết quả tìm kiếm
  return (
    <Container className="my-4">
      <h2 className="text-success mb-4">
        Kết quả tìm kiếm cho: "{tuKhoa}"
      </h2>

      {ketQua.length === 0 ? (
        <Alert variant="info">
          Không tìm thấy sản phẩm nào phù hợp với từ khóa "{tuKhoa}"
        </Alert>
      ) : (
        <Row>
          {ketQua.map((sanPham) => (
            <Col key={sanPham.ma_san_pham} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="h-100">
                <Link to={`/san-pham/${sanPham.ma_san_pham}`}>
                  <Card.Img
                    variant="top"
                    src={`http://127.0.0.1:8000/images/${sanPham.hinh_san_pham}.jpg`}
                    alt={sanPham.ten_san_pham}
                    onError={(e) => {
                      e.target.src = "/images/placeholder.jpg";
                    }}
                  />
                </Link>
                <Card.Body>
                  <Card.Title>
                    <Link 
                      to={`/san-pham/${sanPham.ma_san_pham}`} 
                      className="text-decoration-none text-dark"
                    >
                      {sanPham.ten_san_pham}
                    </Link>
                  </Card.Title>
                  <Card.Text className="text-danger fw-bold">
                    {Number(sanPham.gia_san_pham).toLocaleString("vi-VN")}đ
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default TimKiem;
