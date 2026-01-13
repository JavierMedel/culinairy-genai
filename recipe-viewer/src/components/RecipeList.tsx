import React, { useState, useEffect } from 'react';
import RecipeCard from './RecipeCard';
import type { Recipe } from '../types';
import './RecipeList.css';
import recipesData from '../data/recipes.json';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const RecipeList: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { toggleCart, items } = useCart();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        // In a real app, this might be an API call
        // The JSON structure has a "recipes" key which is an array
        // @ts-ignore - The JSON import might not perfectly match the strict type without casting
        setRecipes(recipesData.recipes as unknown as Recipe[]);
    }, []);

    const filteredRecipes = recipes.filter(recipe => {
        const term = searchTerm.toLowerCase();
        return (
            recipe.title.toLowerCase().includes(term) ||
            recipe.ingredients.some(ing => ing.name.toLowerCase().includes(term)) ||
            recipe.tags.some(tag => tag.toLowerCase().includes(term))
        );
    });

    return (
        <div className="recipe-list-container">
            <header className="recipe-list-header">
                <div className="header-content">
                    <h1 className="app-title">Culin<span className="accent">AI</span>ry</h1>
                </div>
                <div className="search-bar-container">
                    <input
                        type="text"
                        placeholder="Search recipes, ingredients, tags..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </header>

            <div className="recipe-grid">
                {filteredRecipes.map(recipe => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
            </div>

            {filteredRecipes.length === 0 && (
                <div className="no-results">
                    <p>No recipes found matching "{searchTerm}"</p>
                </div>
            )}
        </div>
    );
};

export default RecipeList;
