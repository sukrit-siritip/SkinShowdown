import Footer from "@/components/footer";
import Header from "@/components/header";

export default function PublicLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
