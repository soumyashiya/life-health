import { useEffect, useState } from "react";
import { Preloader } from "./components/Preloader";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { WhyUs } from "./components/WhyUs";
import { Projects } from "./components/Projects";
import { Testimonials } from "./components/Testimonials";
import { FAQ } from "./components/FAQ";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { CustomCursor } from "./components/CustomCursor";
import { ScrollProgress } from "./components/ScrollProgress";
import { ProductDetail } from "./components/ProductDetail";
import { ShopPage } from "./components/ShopPage";
import { SciencePage } from "./components/SciencePage";
import { AboutPage } from "./components/AboutPage";
import { ProductFinder } from "./components/ProductFinder";
import { PolicyPage } from "./components/PolicyPage";
import { CartDrawer } from "./components/CartDrawer";
import { CartPage } from "./components/CartPage";
import { CheckoutPage } from "./components/CheckoutPage";
import { LoginPage } from "./components/LoginPage";
import { AccountPage } from "./components/AccountPage";
import { OrderTracking } from "./components/OrderTracking";
import { PaymentCapturePage } from "./components/PaymentCapturePage";
import { CartProvider } from "./hooks/useCart";
import { RouterProvider, useRouter } from "./hooks/useRouter";
import { AuthProvider } from "./hooks/useAuth";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { sendFingerprintOnce } from "./lib/fingerprint";
import "./styles/portfolio.css";

function AppShell() {
  const [ready, setReady] = useState(false);
  const { view } = useRouter();
  useSmoothScroll(ready);

  const isHome = view.name === "home";

  // Keep ScrollTrigger from firing pins while the home view is hidden.
  useEffect(() => {
    document.body.classList.toggle("is-product-view", !isHome);
  }, [isHome]);

  useEffect(() => {
    void sendFingerprintOnce();
  }, []);

  return (
    <>
      {!ready && <Preloader onComplete={() => setReady(true)} />}
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <main className="view view--home" hidden={!isHome} aria-hidden={!isHome}>
        <Hero />
        <About />
        <Services />
        <Projects />
        <WhyUs />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      {view.name === "shop" && (
        <main className="view view--page">
          <ShopPage research={view.research} />
        </main>
      )}
      {view.name === "science" && (
        <main className="view view--page view--flush">
          <SciencePage section={view.section} />
        </main>
      )}
      {view.name === "about" && (
        <main className="view view--page view--flush">
          <AboutPage />
        </main>
      )}
      {view.name === "find" && (
        <main className="view view--page">
          <ProductFinder />
        </main>
      )}
      {view.name === "product" && (
        <main className="view view--product">
          <ProductDetail id={view.id} />
        </main>
      )}
      {view.name === "policy" && (
        <main className="view view--page">
          <PolicyPage slug={view.slug} />
        </main>
      )}
      {view.name === "cart" && (
        <main className="view view--page">
          <CartPage />
        </main>
      )}
      {view.name === "checkout" && (
        <main className="view view--page">
          <CheckoutPage />
        </main>
      )}
      {view.name === "login" && (
        <main className="view view--page view--auth">
          <LoginPage redirect={view.redirect} />
        </main>
      )}
      {view.name === "account" && (
        <main className="view view--page">
          <AccountPage />
        </main>
      )}
      {view.name === "track" && (
        <main className="view view--page">
          <OrderTracking />
        </main>
      )}
      {view.name === "payment-capture" && (
        <main className="view view--page">
          <PaymentCapturePage token={view.token} />
        </main>
      )}
      <Footer />
      <CartDrawer />
    </>
  );
}

function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <CartProvider>
          <AppShell />
        </CartProvider>
      </AuthProvider>
    </RouterProvider>
  );
}

export default App;
