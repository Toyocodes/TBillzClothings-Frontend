import { Navigate, useLocation } from "react-router-dom";
import Spinner from "./spinner";

function CheckAuth({ isAuthenticated, user, isCheckingAuth, children }) {
  const location = useLocation();

  // Don't decide redirects on a stale/default auth state — wait for the
  // one-time session check to resolve before evaluating any of the rules
  // below. This only affects auth-gated routes (admin, checkout, account,
  // etc.); public pages like /shop/home render immediately since they
  // aren't wrapped in CheckAuth at all.
  if (isCheckingAuth) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-7 w-7 text-primary" />
      </div>
    );
  }

  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/shop/home" />;
    } else {
      if (user?.role === "admin") {
        return <Navigate to="/admin/dashboard" />;
      } else {
        return <Navigate to="/shop/home" />;
      }
    }
  }

  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register") ||
      location.pathname.includes("/forgot-password") || // ✅ add this
      location.pathname.includes("/reset-password") || // ✅ add this
      location.pathname.includes("/shop/home")
    )
  ) {
    return <Navigate to="/auth/login" />;
  }

  // if (
  //   !isAuthenticated &&
  //   !(
  //     location.pathname.includes("/login") ||
  //     location.pathname.includes("/register") ||
  //     location.pathname.includes("/shop/home")
  //   )
  // ) {
  //   return <Navigate to="/auth/login" />;
  // }

  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.includes("shop")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;
