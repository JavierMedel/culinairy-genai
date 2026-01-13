import React from 'react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import './GlobalControls.css';

const GlobalControls: React.FC = () => {
    const { items, toggleCart } = useCart();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="global-controls">
            <button
                onClick={toggleTheme}
                className="control-btn theme-btn"
                aria-label="Toggle Theme"
                title="Toggle Dark Mode"
            >
                {theme === 'light' ? '🌙' : '☀️'}
            </button>

            <button
                onClick={toggleCart}
                className="control-btn cart-btn"
                aria-label="View Cart"
                title="View Cart"
            >
                🛒
                {items.length > 0 && (
                    <span className="cart-badge">
                        {items.length}
                    </span>
                )}
            </button>
        </div>
    );
};

export default GlobalControls;
