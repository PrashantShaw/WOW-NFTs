import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar/Navbar";
import React from "react";

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
    </main>
  );
};

export default layout;
