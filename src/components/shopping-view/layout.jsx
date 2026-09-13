import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";

function ShoppingLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex flex-col w-full">
        <Outlet />
      </main>
    </div>
  );
}

export default ShoppingLayout;
