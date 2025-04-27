import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./MainLayout";
import GioHang from "./GioHang";
import GioiThieu from "./GioiThieu";
import Authentication from "./Authentication";
import CustomToast from "./CustomToast";
import ThanhToan from "./ThanhToan";  
import HoiDap from "./HoiDap";
import TinTuc from "./TinTuc";
import LienHe from "./LienHe";
import TinTucDetail from './TinTucDetail';
import DanhMucSanPham from "./DanhMucSanPham";
import ThongTinSanPham from "./ThongTinSanPham";
import ThankYou from "./ThankYou";
import TimKiem from "./TimKiem";
import Footer from "./Footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import HuongDanMuaHang from "./HuongDanMuaHang";
import Admin from "./Admin/admin";


const App = () => {
  return (
    <><Routes>
      {/* Routes with Main Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<MainLayout />} />
        <Route path="/gio-hang" element={<GioHang />} />
        <Route path="/gioi-thieu" element={<GioiThieu />} />
        <Route path="/thanh-toan" element={<ThanhToan />} />
        <Route path="/hoi-dap" element={<HoiDap />} />
        <Route path="/tin-tuc" element={<TinTuc />} />
        <Route path="/lien-he" element={<LienHe />} />
        <Route path="/tin-tuc/:id" element={<TinTucDetail />} />
        <Route path="/danh-muc/:maDanhMuc" element={<DanhMucSanPham />} />
        <Route path="/san-pham/:maSanPham" element={<ThongTinSanPham />} />
        <Route path="/huong-dan-mua-hang" element={<HuongDanMuaHang />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/tim-kiem" element={<TimKiem />} />
       

    
       
      </Route>
      {/* Trang Admin riêng biệt */}
      <Route path="/admin" element={<Admin />} />


      <Route element={<Authentication />}>
        <Route path="/dang-nhap" element={<Authentication />} />
        <Route path="/dang-ky" element={<Authentication />} />
      </Route>
    </Routes>
    <CustomToast />
    <Footer /> 
    </>

  );
};

export default App;