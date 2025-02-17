import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar/Navbar";
import React from "react";
import { Toaster } from "react-hot-toast";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className="">
      <Navbar />
      <div className="container px-6 mx-auto">{children}</div>
      <Footer />
      <Toaster />
    </main>
  );
};

export default layout;
