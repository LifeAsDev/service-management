import CreateAttribute from "@/components/attributes/createAttribute/createAttribute";

export default function Page({ params }: { params: any }) {
  return <CreateAttribute id={params.id} />;
}
