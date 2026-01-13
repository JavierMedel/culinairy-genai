import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Recipe } from '../types';

export interface CartItem {
    id: string; // Composite ID or Ingredient ID
    name: string;
    quantity: string;
    image_url: string;
    recipeTitle: string;
    recipeId: string;
    recipeImageUrl: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (recipe: Recipe) => void;
    removeFromCart: (itemId: string) => void;
    clearCart: () => void;
    isCartOpen: boolean;
    toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>(() => {
        try {
            const saved = localStorage.getItem('culinary-cart');
            const parsed = saved ? JSON.parse(saved) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.warn('Failed to parse cart from local storage', error);
            return [];
        }
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('culinary-cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (recipe: Recipe) => {
        const newItems = recipe.ingredients.map(ing => ({
            id: `${recipe.id}-${ing.name}`, // Simple unique key
            name: ing.name,
            quantity: ing.quantity,
            image_url: ing.image_url,
            recipeTitle: recipe.title,
            recipeId: recipe.id,
            recipeImageUrl: recipe.image_url
        }));

        setItems(prev => {
            // Filter out duplicates based on ID if needing to update, 
            // but for ingredients usually we might want to stack them.
            // For simplicity let's just append new ones that aren't exact matches,
            // or just add them all and let user manage. 
            // Let's filter out ones that strictly match ID to avoid double-adding same recipe accidentally?
            // Actually, if I add the same recipe twice, I probably want double ingredients.
            // But usually "Add to Cart" implies "Ensure these are in cart".
            // Let's go with: Add items that aren't already there.

            const existingIds = new Set(prev.map(i => i.id));
            const textToAdd = newItems.filter(i => !existingIds.has(i.id));

            if (textToAdd.length === 0) {
                // Maybe notify user? For now just open cart
                return prev;
            }
            return [...prev, ...textToAdd];
        });

        setIsCartOpen(true);
    };

    const removeFromCart = (itemId: string) => {
        setItems(prev => prev.filter(item => item.id !== itemId));
    };

    const clearCart = () => {
        setItems([]);
    };

    const toggleCart = () => {
        setIsCartOpen(prev => !prev);
    };

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, isCartOpen, toggleCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
