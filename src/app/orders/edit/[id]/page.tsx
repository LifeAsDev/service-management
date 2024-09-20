import CreateOrder from "@/components/orders/createOrder/createOrder";

export default function Page({ params }: { params: any }) {
  return <CreateOrder id={params.id} />;
}
