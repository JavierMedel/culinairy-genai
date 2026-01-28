import React, { useMemo, useState } from 'react';
import { useCart, type CartItem } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './CartPage.css';

const CartPage: React.FC = () => {
    const { items, removeFromCart, clearCart } = useCart();
    const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

    // Group items by recipe for the left sidebar
    const itemsByRecipe = useMemo(() => {
        return items.reduce((acc, item) => {
            if (!acc[item.recipeId]) {
                acc[item.recipeId] = {
                    id: item.recipeId,
                    title: item.recipeTitle,
                    imageUrl: item.recipeImageUrl,
                    items: [],
                    totalIngredients: 0
                };
            }
            acc[item.recipeId].items.push(item);
            acc[item.recipeId].totalIngredients++;
            return acc;
        }, {} as Record<string, { id: string; title: string; imageUrl: string; items: CartItem[]; totalIngredients: number }>);
    }, [items]);

    // Determine which ingredients to show and highlight
    const displayedIngredients = useMemo(() => {
        // Show all items, but mark which ones belong to selected recipe
        const relevanceMap = new Set<string>();
        if (selectedRecipeId) {
            items.filter(item => item.recipeId === selectedRecipeId).forEach(item => relevanceMap.add(item.id));
        }

        // Aggregate by ingredient name
        const grouped = items.reduce((acc, item) => {
            if (!acc[item.name]) {
                acc[item.name] = {
                    name: item.name,
                    image_url: item.image_url,
                    quantities: [],
                    ids: [],
                    isHighlighted: false
                };
            }
            acc[item.name].quantities.push(item.quantity);
            acc[item.name].ids.push(item.id);

            // If any item in this group is relevant (or if no recipe selected), highlight the group
            // Actually, if a recipe is selected, we only want to highlight if this SPECIFIC ingredient instance is relevant.
            // But since we group by name, if "Salt" is in both Recipe A and Recipe B, and Recipe A is selected, should "Salt" be highlighted? Yes.
            // Logic: 
            // - If no recipe selected -> All highlighted (or none dimmed).
            // - If recipe selected -> Highlight if this ingredient name appears in the selected recipe.

            const isRelevant = !selectedRecipeId || item.recipeId === selectedRecipeId;
            if (isRelevant) {
                acc[item.name].isHighlighted = true;
            }

            return acc;
        }, {} as Record<string, { name: string; image_url: string; quantities: string[]; ids: string[]; isHighlighted: boolean }>);

        // If a recipe is selected, ensure that groups that DON'T have the ingredient from that recipe are marked not highlighted.
        // My reduce logic above sets isHighlighted = true if *any* occurrence is relevant. This is correct.
        // If "Salt" is in Recipe A and B. Selected A. "Salt" encounters Item A (relevant -> true). Encounters Item B (not relevant). Final = true.
        // If "Cumin" is only in Recipe B. Selected A. "Cumin" encounters Item B (not relevant). Final = false (default?).
        // Wait, default needs to be false if we want strict highlighting. 
        // Let's refine: default to false. If ANY item matches selectedRecipeId, set true.
        // If selectedRecipeId is null, FORCE true for all.

        return Object.values(grouped).map(group => ({
            ...group,
            isHighlighted: !selectedRecipeId || group.isHighlighted
        }));
    }, [items, selectedRecipeId]);


    if (items.length === 0) {
        return (
            <div className="cart-page-empty">
                <h1>Your Cart is Empty</h1>
                <p>Looks like you haven't added any recipes yet.</p>
                <Link to="/" className="back-to-home-btn">Browse Recipes</Link>
            </div>
        );
    }

    const handleRecipeClick = (id: string) => {
        if (selectedRecipeId === id) {
            setSelectedRecipeId(null); // Deselect if already selected
        } else {
            setSelectedRecipeId(id);
        }
    };

    const handleIngredientClick = (ing: { ids: string[] }) => {
        // If we have ids, find the first recipeId associated with them
        // Note: displayedIngredients already filters by selectedRecipeId if active.
        // But if no recipe is selected, we want to select the recipe this ingredient belongs to.

        // Find the recipe ID for the first occurrence of this ingredient
        const firstItemId = ing.ids[0];
        const item = items.find(i => i.id === firstItemId);

        if (item) {
            // Check if this recipe is already selected
            if (selectedRecipeId === item.recipeId) {
                // If already selected, do we deselect? The user prompt says "select the dish".
                // Usually clicking a selected item again deselects or does nothing.
                // Let's assume deselect for toggle behavior, or maybe stay selected.
                // Let's deselect to allow looking at other things easily? 
                // Actually, if I click an ingredient in the "All" view, I want to filter to that recipe.
                setSelectedRecipeId(item.recipeId);
            } else {
                // Select the new recipe
                setSelectedRecipeId(item.recipeId);
            }
        }
    };

    return (
        <div className="cart-page-container">
            <header className="cart-page-header">
                <h1>Shopping Cart</h1>
                <div className="header-actions">
                    <button className="clear-cart-text" onClick={clearCart}>Clear All</button>
                    <Link to="/" className="continue-shopping">← Back</Link>
                </div>
            </header>

            <div className="cart-grid">
                {/* Left Column: Recipe List */}
                <div className="cart-recipes-sidebar">
                    {Object.values(itemsByRecipe).map((recipe) => (
                        <div
                            key={recipe.id}
                            className={`recipe-select-card ${selectedRecipeId === recipe.id ? 'active' : ''}`}
                            onClick={() => handleRecipeClick(recipe.id)}
                        >
                            <img src={`/${recipe.imageUrl}`} alt={recipe.title} className="recipe-select-thumb" />
                            <h3>{recipe.title}</h3>
                        </div>
                    ))}

                    {/* Visual cue for "View All" if a recipe is selected */}
                    {selectedRecipeId && (
                        <button className="view-all-btn" onClick={() => setSelectedRecipeId(null)}>
                            View All Ingredients
                        </button>
                    )}
                </div>

                {/* Right Column: Ingredient Grid */}
                <div className="cart-ingredients-panel">
                    <h2 className="panel-title">
                        {selectedRecipeId
                            ? `Ingredients for ${itemsByRecipe[selectedRecipeId]?.title}`
                            : 'All Shopping List Items'}
                    </h2>

                    <div className="ingredients-grid">
                        {displayedIngredients.map((ing) => (
                            <div
                                key={ing.name}
                                className={`ingredient-card ${!ing.isHighlighted ? 'dimmed' : ''}`}
                                onClick={() => handleIngredientClick(ing)}
                                style={{ cursor: 'pointer' }}
                            >
                                <img src={`/${ing.image_url}`} alt={ing.name} className="ingredient-card-thumb" />
                                <div className="ingredient-card-details">
                                    <h4 className="ingredient-name">{ing.name}</h4>
                                    <div className="ingredient-quantities">
                                        {ing.quantities.map((qty, idx) => (
                                            <span key={idx} className="qty-tag">{qty}</span>
                                        ))}
                                    </div>
                                    <div className="ingredient-actions">
                                        {/* Remove button removes all instances of this ingredient for simplicity in this view, 
                                            or we could iterate IDs. Let's iterate ids to remove specific ones. */}
                                        {ing.ids.map(id => (
                                            <button
                                                key={id}
                                                className="remove-text-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeFromCart(id);
                                                }}
                                            >
                                                Remove
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
