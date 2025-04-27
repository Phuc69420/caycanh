import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { tinTucData } from './data/tinTucData';

const TinTucDetail = () => {
  const { id } = useParams();
  const tinTuc = tinTucData.find(post => post.id === parseInt(id));

  if (!tinTuc) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          Không tìm thấy bài viết
        </div>
        <Link to="/tin-tuc" className="btn btn-outline-success">
          ← Quay lại tin tức
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Trang chủ</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/tin-tuc">Tin tức</Link>
          </li>
          <li className="breadcrumb-item active">{tinTuc.title}</li>
        </ol>
      </nav>

      <div className="row">
        <div className="col-md-8">
          <article className="blog-post">
            <h1 className="text-success mb-3">{tinTuc.title}</h1>
            <div className="mb-3 text-muted">
              <small>
                <i className="bi bi-calendar3"></i> {tinTuc.date} |{" "}
                <i className="bi bi-folder2"></i> {tinTuc.category} |{" "}
                <i className="bi bi-person"></i> {tinTuc.author}
              </small>
            </div>
            <img
              src={`http://127.0.0.1:8000/images/news/${tinTuc.image}`}
              className="img-fluid rounded mb-4"
              alt={tinTuc.title}
            />
            <div 
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: tinTuc.content }}
            />
          </article>
        </div>

        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Bài viết liên quan</h5>
            </div>
            <div className="list-group list-group-flush">
              {tinTucData
                .filter(post => post.id !== parseInt(id))
                .slice(0, 4)
                .map(post => (
                  <Link
                    key={post.id}
                    to={`/tin-tuc/${post.id}`}
                    className="list-group-item list-group-item-action"
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={`http://127.0.0.1:8000/images/news/${post.image}`}
                        alt={post.title}
                        className="me-2"
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                      <small>{post.title}</small>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TinTucDetail;