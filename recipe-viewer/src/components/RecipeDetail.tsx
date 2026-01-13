import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Recipe } from '../types';
import recipesData from '../data/recipes.json';
import { useCart } from '../context/CartContext';
import './RecipeDetail.css';

const RecipeDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const { addToCart, toggleCart } = useCart();

    useEffect(() => {
        // In a real app, fetch by ID. Here, find in JSON.
        const foundRecipe = (recipesData.recipes as unknown as Recipe[]).find(r => r.id === id);
        setRecipe(foundRecipe || null);
    }, [id]);

    if (!recipe) {
        return <div className="loading">Loading recipe...</div>;
    }

    return (
        <div className="recipe-detail-container">
            <div className="recipe-hero">
                <div className="hero-content">
                    <Link to="/" className="back-link">← Back to Recipes</Link>
                    <div className="hero-tags">
                        {recipe.tags.map(tag => (
                            <span key={tag} className="hero-tag">{tag}</span>
                        ))}
                    </div>
                    <h1 className="hero-title">{recipe.title}</h1>
                    <p className="hero-subtitle">{recipe.subtitle}</p>
                    <p className="hero-description">{recipe.description}</p>

                    <div className="hero-actions" style={{ marginTop: '16px', display: 'flex', gap: '16px' }}>
                        <button
                            onClick={() => addToCart(recipe)}
                            className="add-to-cart-btn"
                            style={{
                                background: '#E63946',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '100px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <span>+</span> Add Ingredients to Cart
                        </button>
                        <button
                            onClick={toggleCart}
                            className="view-cart-btn"
                            style={{
                                background: 'white',
                                color: '#333',
                                border: '2px solid #eee',
                                padding: '12px 24px',
                                borderRadius: '100px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            View Cart
                        </button>
                    </div>

                    <div className="hero-meta">
                        <div className="meta-item">
                            <span className="meta-label">Total Time</span>
                            <span className="meta-value">{recipe.total_time}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Prep Time</span>
                            <span className="meta-value">{recipe.prep_time}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Servings</span>
                            <span className="meta-value">{recipe.servings} ({recipe.serving_size})</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Calories</span>
                            <span className="meta-value">{recipe.calories_per_serving}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Difficulty</span>
                            <span className="meta-value">{recipe.difficulty}</span>
                        </div>
                    </div>
                </div>
                <div className="hero-image-container">
                    <img src={`/${recipe.image_url}`} alt={recipe.title} className="hero-image" />
                </div>
            </div>

            <div className="recipe-content-grid">
                <div className="ingredients-section">
                    <h2>Ingredients</h2>
                    <div className="ingredients-list">
                        {recipe.ingredients.map((ing, idx) => (
                            <div key={idx} className="ingredient-item">
                                <img src={`/${ing.image_url}`} alt={ing.name} className="ingredient-image" />
                                <div className="ingredient-details">
                                    <span className="ingredient-name">{ing.name}</span>
                                    <span className="ingredient-quantity">{ing.quantity}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {recipe.not_included_in_delivery && recipe.not_included_in_delivery.length > 0 && (
                        <>
                            <h3 className="pantry-title">From Your Pantry</h3>
                            <div className="ingredients-list">
                                {recipe.not_included_in_delivery.map((ing, idx) => (
                                    <div key={idx} className="ingredient-item pantry-item">
                                        <img src={`/${ing.image_url}`} alt={ing.name} className="ingredient-image" />
                                        <div className="ingredient-details">
                                            <span className="ingredient-name">{ing.name}</span>
                                            <span className="ingredient-quantity">{ing.quantity}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    <div className="nutrition-card">
                        <h3>Nutrition per serving</h3>
                        <div className="nutrition-grid">
                            <div className="nutrition-item">
                                <span>Calories</span>
                                <strong>{recipe.nutrition_values.per_serving.calories}</strong>
                            </div>
                            <div className="nutrition-item">
                                <span>Fat</span>
                                <strong>{recipe.nutrition_values.per_serving.fat}</strong>
                            </div>
                            <div className="nutrition-item">
                                <span>Carbs</span>
                                <strong>{recipe.nutrition_values.per_serving.carbohydrate}</strong>
                            </div>
                            <div className="nutrition-item">
                                <span>Protein</span>
                                <strong>{recipe.nutrition_values.per_serving.protein}</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="steps-section">
                    <h2>Cooking Instructions</h2>
                    <div className="steps-list">
                        {recipe.cooking_steps.map((step) => (
                            <div key={step.step} className="step-card">
                                <div className="step-number">{step.step}</div>
                                <div className="step-content">
                                    <p className="step-description">{step.description}</p>
                                    {step.image_url && (
                                        <img src={`/${step.image_url}`} alt={`Step ${step.step}`} className="step-image" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;
