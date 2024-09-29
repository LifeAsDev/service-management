import Invoice from "@/components/invoice/invoice";

export default function Page({ params }: { params: any }) {
  return <Invoice id={params.orderId} />;
}
