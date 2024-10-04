"use client";
import { useOnboardingContext } from "@/lib/context";
import styles from "./styles.module.css";
import { usePathname } from "next/navigation";

export default function MainWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { asideOpen } = useOnboardingContext();
  const currentPage = usePathname();

  const inLoginPage = currentPage === "/login";

  return (
    <div
      className={`${styles.mainWrapper} ${asideOpen && styles.close} ${
        inLoginPage && styles.inLoginPage
      }`}
    >
      {children}
    </div>
  );
}
