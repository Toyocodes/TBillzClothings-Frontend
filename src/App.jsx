import { Route, Routes, Navigate } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingProductDetailPage from "./pages/shopping-view/product-detail";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import PaystackReturnPage from "./pages/shopping-view/paystack-return";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/search";
import Wishlist from "./pages/shopping-view/wishlist";
import FAQPage from "./pages/shopping-view/faq";
import ForgotPassword from "./pages/auth/forgot-password";
import ResetPassword from "./pages/auth/reset-password";

function App() {
  const { user, isAuthenticated, isCheckingAuth } = useSelector(
    (state) => state.auth,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Routes>
        <Route path="/" element={<Navigate to="/shop/home" />} />

        {/* Public Auth Pages */}
        <Route
          path="/auth"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
              isCheckingAuth={isCheckingAuth}
            >
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
        </Route>

        <Route
          path="/admin"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
              isCheckingAuth={isCheckingAuth}
            >
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

        <Route path="/shop" element={<ShoppingLayout />}>
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="product/:productId" element={<ShoppingProductDetailPage />} />
          <Route path="faq" element={<FAQPage />} />
        </Route>

        {/* Protected SHOP Pages - require auth */}
        <Route
          path="/shop"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
              isCheckingAuth={isCheckingAuth}
            >
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="paystack-return" element={<PaystackReturnPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
        </Route>

        <Route path="/search" element={<SearchProducts />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
