import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Index from "./pages/Index";
import ProductsPage from "./pages/ProductsPage";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AccountPage from "./pages/AccountPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />

                  {/* Product listing routes */}
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/category/:slug" element={<ProductsPage />} />

                  {/* Legacy category routes (redirect to /category/:slug) */}
                  <Route path="/men" element={<ProductsPage />} />
                  <Route path="/women" element={<ProductsPage />} />
                  <Route path="/kids" element={<ProductsPage />} />
                  <Route path="/accessories" element={<ProductsPage />} />

                  {/* Product detail */}
                  <Route path="/product/:id" element={<ProductDetail />} />

                  {/* Cart & Checkout */}
                  <Route path="/cart" element={<CartPage />} />

                  {/* Auth */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />

                  {/* Account */}
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/account/orders" element={<AccountPage />} />

                  {/* Info */}
                  <Route path="/about" element={<AboutPage />} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <WhatsAppButton />
            </div>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
