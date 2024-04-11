import { type ReactNode } from "react";
import Navbar from "src/components/Navbar";
export default function Main({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="flex flex-col h-screen overflow-hidden font-libre">
        <Navbar />
        <div className="grow h-full">{children}</div>
      </div>
    </>
  );
}
