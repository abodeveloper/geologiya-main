import { Toaster } from "sonner";
import AppRouter from "./router/AppRouter";
import ContactFormModal from "./shared/components/moleculas/ContactFormModal";
import ScrollToTop from "./shared/components/moleculas/ScrollToTop";

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <AppRouter />
      <ContactFormModal />
      <ScrollToTop/>
    </>
  );
}

export default App;
