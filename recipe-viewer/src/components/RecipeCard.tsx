import React from 'react';
import type { Recipe } from '../types';
import { Link } from 'react-router-dom';
import './RecipeCard.css';
import { useCart } from '../context/CartContext';

interface RecipeCardProps {
    recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    const { addToCart } = useCart();

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(recipe);
    };

    return (
        <Link to={`/recipe/${recipe.id}`} className="recipe-card">
            <div className="recipe-card-image-container">
                <img
                    src={`/${recipe.image_url}`}
                    alt={recipe.title}
                    className="recipe-card-image"
                    loading="lazy"
                />
                <div className="recipe-card-overlay">
                    <span className="recipe-difficulty">{recipe.difficulty}</span>
                </div>
            </div>
            <div className="recipe-card-content">
                <div className="recipe-tags">
                    {recipe.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="recipe-tag">{tag}</span>
                    ))}
                </div>
                <h3 className="recipe-title">{recipe.title}</h3>
                <p className="recipe-subtitle">{recipe.subtitle}</p>
                <div className="recipe-meta">
                    <span className="recipe-time">⏱ {recipe.total_time}</span>
                    <div className="meta-right">
                        <span className="recipe-calories">🔥 {recipe.calories_per_serving}</span>
                        <button
                            className="quick-add-btn"
                            onClick={handleQuickAdd}
                            title="Add to Cart"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default RecipeCard;
