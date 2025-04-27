import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  console.log("Trang ThankYou đã mount!");
  console.log("orderId:", orderId);
  useEffect(() => {
    const shouldClearCart = searchParams.get("clearCart") === "1";
    if (shouldClearCart) {
      localStorage.removeItem("gioHang");
    }
  }, [searchParams]);

  return (
    <div className="container text-center py-5">
      <h2 className="text-success">🎉 Cảm ơn bạn đã đặt hàng!</h2>
      <p>Mã đơn hàng của bạn là: <strong>{orderId}</strong></p>
      <p>Chúng tôi sẽ liên hệ và giao hàng sớm nhất có thể.</p>
      <a href="/" className="btn btn-primary mt-4">Về trang chủ</a>
    </div>
  );
};

export default ThankYou;
