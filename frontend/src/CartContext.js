import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("gioHang");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Đồng bộ cartItems vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem("gioHang", JSON.stringify(cartItems));
  }, [cartItems]);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (product) => {
    setCartItems((prev) => {
      const exist = prev.find((item) => item.ma_san_pham === product.ma_san_pham);
      if (exist) {
        return prev.map((item) =>
          item.ma_san_pham === product.ma_san_pham
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.ma_san_pham !== id));
  };

  // Cập nhật số lượng sản phẩm
  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.ma_san_pham === id ? { ...item, quantity } : item
        )
      );
    }
  };

  // Tính tổng số lượng sản phẩm trong giỏ hàng
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Tính tổng tiền trong giỏ hàng
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.gia_san_pham,
    0
  );

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalItems,
        totalPrice,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};