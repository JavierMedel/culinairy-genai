import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import CartPage from './components/CartPage';
import GlobalControls from './components/GlobalControls';
import CartSidebar from './components/CartSidebar';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <CartProvider>
          <div className="app-container">
            <GlobalControls />
            <CartSidebar />
            <Routes>
              <Route path="/" element={<RecipeList />} />
              <Route path="/recipe/:id" element={<RecipeDetail />} />
              <Route path="/cart" element={<CartPage />} />
            </Routes>
          </div>
        </CartProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
