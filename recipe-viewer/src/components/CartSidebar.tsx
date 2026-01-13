import React from 'react';
import { useCart } from '../context/CartContext';
import './CartSidebar.css';

const CartSidebar: React.FC = () => {
    const { items, removeFromCart, isCartOpen, toggleCart, clearCart } = useCart();

    // Group items by recipe for better display
    const [orderedRecipes, setOrderedRecipes] = React.useState<string[]>([]);

    // Group items by recipe
    const itemsByRecipe = React.useMemo(() => items.reduce((acc, item) => {
        if (!acc[item.recipeTitle]) {
            acc[item.recipeTitle] = [];
        }
        acc[item.recipeTitle].push(item);
        return acc;
    }, {} as Record<string, typeof items>), [items]);

    // Initialize or sync order when items change
    React.useEffect(() => {
        const currentTitles = Object.keys(itemsByRecipe);
        setOrderedRecipes(prev => {
            // Keep existing order for items that still exist
            const newOrder = prev.filter(title => currentTitles.includes(title));
            // Append new items
            currentTitles.forEach(title => {
                if (!newOrder.includes(title)) {
                    newOrder.push(title);
                }
            });
            return newOrder;
        });
    }, [itemsByRecipe]);

    const handleDragStart = (e: React.DragEvent, title: string) => {
        e.dataTransfer.setData('text/plain', title);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetTitle: string) => {
        e.preventDefault();
        const draggedTitle = e.dataTransfer.getData('text/plain');
        if (draggedTitle === targetTitle) return;

        setOrderedRecipes(prev => {
            const newOrder = [...prev];
            const draggedIdx = newOrder.indexOf(draggedTitle);
            const targetIdx = newOrder.indexOf(targetTitle);

            if (draggedIdx !== -1 && targetIdx !== -1) {
                newOrder.splice(draggedIdx, 1);
                newOrder.splice(targetIdx, 0, draggedTitle);
            }
            return newOrder;
        });
    };

    return (
        <>
            <div
                className={`cart-overlay ${isCartOpen ? 'open' : ''}`}
                onClick={toggleCart}
            />
            <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h2>Your Cart ({items.length})</h2>
                    <button className="close-btn" onClick={toggleCart}>×</button>
                </div>

                <div className="cart-content">
                    {items.length === 0 ? (
                        <div className="empty-cart">
                            <p>Your cart is empty.</p>
                            <p className="empty-hint">Add recipes to generate a shopping list!</p>
                        </div>
                    ) : (
                        <>
                            {orderedRecipes.map((recipeTitle) => {
                                const groupItems = itemsByRecipe[recipeTitle];
                                if (!groupItems) return null;
                                return (
                                    <div
                                        key={recipeTitle}
                                        className="cart-recipe-group"
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, recipeTitle)}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, recipeTitle)}
                                        style={{ cursor: 'grab' }}
                                    >
                                        <h3 className="cart-recipe-title">
                                            <span className="drag-handle">☰</span> {recipeTitle}
                                        </h3>
                                        <ul className="cart-items-list">
                                            {groupItems.map(item => (
                                                <li key={item.id} className="cart-item">
                                                    <img src={`/${item.image_url}`} alt={item.name} className="cart-item-img" />
                                                    <div className="cart-item-details">
                                                        <span className="cart-item-name">{item.name}</span>
                                                        <span className="cart-item-qty">{item.quantity}</span>
                                                    </div>
                                                    <button
                                                        className="remove-item-btn"
                                                        onClick={() => removeFromCart(item.id)}
                                                        aria-label="Remove item"
                                                    >
                                                        ×
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}

                            <div className="cart-actions">
                                <button className="clear-cart-btn" onClick={clearCart}>
                                    Clear Cart
                                </button>
                                <a href="/cart" className="checkout-btn" style={{ textAlign: 'center', textDecoration: 'none' }}>
                                    View Full Cart & Checkout
                                </a>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default CartSidebar;
