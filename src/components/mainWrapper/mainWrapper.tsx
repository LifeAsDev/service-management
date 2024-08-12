"use client";
import { useOnboardingContext } from "@/lib/context";
import styles from "./styles.module.css";
export default function MainWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { asideOpen } = useOnboardingContext();

  return (
    <div className={`${styles.mainWrapper} ${asideOpen && styles.close}`}>
      {children}
    </div>
  );
}
