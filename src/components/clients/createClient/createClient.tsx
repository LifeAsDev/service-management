import ClientForm from "@/components/clients/createClient/clientForm/clientForm";
import styles from "./styles.module.css";
export default function CreateClient() {
  return (
    <main className={styles.main}>
      <ClientForm />
    </main>
  );
}
