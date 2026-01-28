import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Recipe } from '../types';
import { useCart } from '../context/CartContext';
import './RecipeDetail.css';

// Dynamically import all JSON files from the recipes directory
const recipeModules = import.meta.glob('../data/recipes/*.json', { eager: true });

const RecipeDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const { addToCart, toggleCart } = useCart();

    useEffect(() => {
        // Find the recipe in the dynamically loaded modules
        const entry = Object.entries(recipeModules).find(([path, module]) => {
            const data = (module as any).default || module;
            const idFromPath = path.split('/').pop()?.replace('-extracted.json', '') || 'unknown';
            return data.id === id || idFromPath === id;
        });

        if (entry) {
            const data = (entry[1] as any).default || entry[1];
            const idFromPath = entry[0].split('/').pop()?.replace('-extracted.json', '') || 'unknown';
            setRecipe({
                ...data,
                id: data.id || idFromPath
            });
        }
    }, [id]);

    if (!recipe) {
        return <div className="loading">Loading recipe...</div>;
    }

    const imageUrl = recipe.image_url.startsWith('http') ? recipe.image_url : `/${recipe.image_url}`;

    return (
        <div className="recipe-detail-container">
            <div className="recipe-hero">
                <div className="hero-content">
                    <Link to="/" className="back-link">← Back to Recipes</Link>
                    <div className="hero-tags">
                        {recipe.tags?.map(tag => (
                            <span key={tag} className="hero-tag">{tag}</span>
                        ))}
                    </div>
                    <h1 className="hero-title">{recipe.title}</h1>
                    {recipe.subtitle && <p className="hero-subtitle">{recipe.subtitle}</p>}
                    {recipe.description && <p className="hero-description">{recipe.description}</p>}

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
                        {recipe.prep_time && (
                            <div className="meta-item">
                                <span className="meta-label">Prep Time</span>
                                <span className="meta-value">{recipe.prep_time}</span>
                            </div>
                        )}
                        {recipe.cook_time && (
                            <div className="meta-item">
                                <span className="meta-label">Cook Time</span>
                                <span className="meta-value">{recipe.cook_time}</span>
                            </div>
                        )}
                        {recipe.servings && (
                            <div className="meta-item">
                                <span className="meta-label">Servings</span>
                                <span className="meta-value">{recipe.servings} {recipe.serving_size ? `(${recipe.serving_size})` : ''}</span>
                            </div>
                        )}
                        <div className="meta-item">
                            <span className="meta-label">Difficulty</span>
                            <span className="meta-value">{recipe.difficulty || 'Easy'}</span>
                        </div>
                    </div>
                </div>
                <div className="hero-image-container">
                    <img src={imageUrl} alt={recipe.title} className="hero-image" />
                </div>
            </div>

            <div className="recipe-content-grid">
                <div className="ingredients-section">
                    <h2>Ingredients</h2>
                    <div className="ingredients-list">
                        {recipe.ingredients?.map((ing, idx) => (
                            <div key={idx} className="ingredient-item">
                                {ing.image_url ? (
                                    <img src={ing.image_url.startsWith('http') ? ing.image_url : `/${ing.image_url}`} alt={ing.name} className="ingredient-image" />
                                ) : (
                                    <div className="ingredient-image-placeholder" style={{ width: '60px', height: '60px', background: '#eee', borderRadius: '8px' }}></div>
                                )}
                                <div className="ingredient-details">
                                    <span className="ingredient-name">{ing.name}</span>
                                    <span className="ingredient-quantity">{ing.amount}</span>
                                    {ing.allergens_info && <span className="ingredient-allergens" style={{ fontSize: '0.8rem', color: '#666', fontStyle: 'italic' }}>{ing.allergens_info}</span>}
                                </div>
                            </div>
                        ))}
                    </div>

                    {recipe.not_included && recipe.not_included.length > 0 && (
                        <>
                            <h3 className="pantry-title">From Your Pantry</h3>
                            <div className="ingredients-list">
                                {recipe.not_included.map((ing, idx) => (
                                    <div key={idx} className="ingredient-item pantry-item">
                                        {ing.image_url ? (
                                            <img src={ing.image_url.startsWith('http') ? ing.image_url : `/${ing.image_url}`} alt={ing.name} className="ingredient-image" />
                                        ) : (
                                            <div className="ingredient-image-placeholder" style={{ width: '60px', height: '60px', background: '#eee', borderRadius: '8px' }}></div>
                                        )}
                                        <div className="ingredient-details">
                                            <span className="ingredient-name">{ing.name}</span>
                                            <span className="ingredient-quantity">{ing.amount}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {recipe.nutrition && (
                        <div className="nutrition-card">
                            <h3>Nutrition Information</h3>
                            <div className="nutrition-grid">
                                {Object.entries(recipe.nutrition).slice(0, 4).map(([key, value]) => (
                                    <div key={key} className="nutrition-item">
                                        <span>{key}</span>
                                        <strong>{value}</strong>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="steps-section">
                    <h2>Cooking Instructions</h2>
                    <div className="steps-list">
                        {recipe.steps?.map((step) => (
                            <div key={step.number} className="step-card">
                                <div className="step-number">{step.number}</div>
                                <div className="step-content">
                                    <div className="step-instructions">
                                        {step.instructions.map((line, i) => (
                                            <p key={i} className="step-description">{line}</p>
                                        ))}
                                    </div>
                                    {step.image_url && (
                                        <img src={step.image_url.startsWith('http') ? step.image_url : `/${step.image_url}`} alt={`Step ${step.number}`} className="step-image" />
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
