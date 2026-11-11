import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { StoreProvider } from './store'
import { CartDrawer, Footer, Header, Toast } from './components/Layout'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import Credits from './pages/Credits'
import Checkout from './pages/Checkout'
import OrderPlaced from './pages/OrderPlaced'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <ScrollToTop />
        <a href="#main" className="skip-link">Skip to content</a>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<OrderPlaced />} />
          <Route path="*" element={<Shop />} />
        </Routes>
        <Footer />
        <CartDrawer />
        <Toast />
      </StoreProvider>
    </BrowserRouter>
  )
}
