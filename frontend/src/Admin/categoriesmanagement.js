import React, { useState } from "react";
import axios from "axios";

const CategoriesManagement = ({ categories, products }) => {
  const [form, setForm] = useState({ ma_danh_muc: "", ten_danh_muc: "" });
  const [editing, setEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [categoryList, setCategoryList] = useState(categories);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddClick = () => {
    setForm({ ma_danh_muc: "", ten_danh_muc: "" });
    setEditing(false);
    setShowForm(true);
  };

  const handleEditClick = (category) => {
    setForm(category);
    setEditing(true);
    setShowForm(true);
  };

  const handleDelete = (ma_danh_muc) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      axios
        .delete(`http://127.0.0.1:8000/api/danhmucsanpham/${ma_danh_muc}`)
        .then(() => {
          setCategoryList(categoryList.filter(c => c.ma_danh_muc !== ma_danh_muc));
        })
        .catch((err) => console.error("Xóa thất bại:", err));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      axios
        .put(`http://127.0.0.1:8000/api/danhmucsanpham/${form.ma_danh_muc}`, form)
        .then((res) => {
          const updatedList = categoryList.map(c =>
            c.ma_danh_muc === form.ma_danh_muc ? res.data : c
          );
          setCategoryList(updatedList);
          setShowForm(false);
        })
        .catch((err) => console.error("Cập nhật thất bại:", err));
    } else {
      axios
        .post("http://127.0.0.1:8000/api/danhmucsanpham", form)
        .then((res) => {
          setCategoryList([...categoryList, res.data]);
          setShowForm(false);
        })
        .catch((err) => console.error("Thêm thất bại:", err));
    }
  };

  return (
    <div className="admin-categories">
      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-success" onClick={handleAddClick}>
          <i className="bi bi-plus-circle"></i> Thêm Danh Mục
        </button>
      </div>

      {showForm && (
        <form className="mb-3" onSubmit={handleSubmit}>
          <div className="row g-2 align-items-center">
            <div className="col-md-3">
              <input
                type="text"
                name="ma_danh_muc"
                className="form-control"
                placeholder="Mã danh mục"
                value={form.ma_danh_muc}
                onChange={handleInputChange}
                required
                disabled={editing}
              />
            </div>
            <div className="col-md-5">
              <input
                type="text"
                name="ten_danh_muc"
                className="form-control"
                placeholder="Tên danh mục"
                value={form.ten_danh_muc}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100">
                {editing ? "Cập nhật" : "Thêm"}
              </button>
            </div>
            <div className="col-md-2">
              <button type="button" className="btn btn-secondary w-100" onClick={() => setShowForm(false)}>
                Hủy
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-success">
            <tr>
              <th>Mã Danh Mục</th>
              <th>Tên Danh Mục</th>
              <th>Số Sản Phẩm</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {categoryList.map((category) => (
              <tr key={category.ma_danh_muc}>
                <td>{category.ma_danh_muc}</td>
                <td>{category.ten_danh_muc}</td>
                <td>
                  {products.filter(p => p.ma_danh_muc === category.ma_danh_muc).length}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-1"
                    onClick={() => handleEditClick(category)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(category.ma_danh_muc)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriesManagement;
