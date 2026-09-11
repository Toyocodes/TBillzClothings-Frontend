import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accImg from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";

function ShoppingAccount() {
  return (
    <div className="flex flex-col bg-background">
      <div className="relative h-[220px] w-full overflow-hidden md:h-[280px]">
        <img
          src={accImg}
          className="h-full w-full object-cover object-center"
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1200px] px-5 pb-6 md:px-10">
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            My Account
          </h1>
        </div>
      </div>
      <div className="mx-auto w-full max-w-[1200px] px-5 py-8 md:px-10">
        <Tabs defaultValue="orders">
          <TabsList className="rounded-xl">
            <TabsTrigger value="orders" className="rounded-lg">Orders</TabsTrigger>
            <TabsTrigger value="address" className="rounded-lg">Address</TabsTrigger>
          </TabsList>
          <TabsContent value="orders" className="mt-4">
            <ShoppingOrders />
          </TabsContent>
          <TabsContent value="address" className="mt-4">
            <Address />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ShoppingAccount;
