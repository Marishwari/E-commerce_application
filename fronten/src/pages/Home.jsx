import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Featured from "../components/Featured";
import Footer from "../components/Footer";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";
import useWelcomeToast from "../hooks/useWelcomeToast";

export default function Home() {
  const { toast, showToast, hideToast } = useToast();
  useWelcomeToast(showToast);

  return (
    <>
      <Navbar />
      <Hero />
      <Featured />
      <Footer />
      <Toast message={toast.message} type={toast.type} onClose={hideToast} />
    </>
  );
}