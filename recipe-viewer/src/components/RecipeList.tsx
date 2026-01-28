import React, { useState, useEffect } from 'react';
import RecipeCard from './RecipeCard';
import type { Recipe } from '../types';
import './RecipeList.css';

// Dynamically import all JSON files from the recipes directory
const recipeModules = import.meta.glob('../data/recipes/*.json', { eager: true });

const RecipeList: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadedRecipes: Recipe[] = Object.entries(recipeModules).map(([path, module]) => {
            const data = (module as any).default || module;

            // Extract a clean ID from the filename (e.g., BBQ_Beef_Meatballs)
            const idFromPath = path.split('/').pop()?.replace('-extracted.json', '') || 'unknown';

            return {
                ...data,
                id: data.id || idFromPath
            };
        });

        setRecipes(loadedRecipes);
    }, []);

    const filteredRecipes = recipes.filter(recipe => {
        const term = searchTerm.toLowerCase();
        return (
            (recipe.title?.toLowerCase() || '').includes(term) ||
            recipe.ingredients?.some(ing => ing.name?.toLowerCase().includes(term)) ||
            recipe.tags?.some(tag => tag.toLowerCase().includes(term))
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
