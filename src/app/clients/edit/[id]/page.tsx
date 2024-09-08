import CreateClient from "@/components/clients/createClient/createClient";

export default function Page({ params }: { params: any }) {
  return <CreateClient id={params.id} />;
}
