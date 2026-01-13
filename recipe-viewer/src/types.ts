export interface Ingredient {
    name: string;
    quantity: string;
    allergens: string[];
    image_url: string;
}

export interface CookingStep {
    step: number;
    description: string;
    image_url: string;
}

export interface NutritionValues {
    per_serving: {
        calories: string;
        fat: string;
        saturated_fat: string;
        carbohydrate: string;
        sugar: string;
        dietary_fiber: string;
        protein: string;
        cholesterol: string;
        sodium: string;
        potassium: string;
        calcium: string;
        iron: string;
    };
}

export interface Recipe {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    prep_time: string;
    cooking_time: string;
    total_time: string;
    servings: string;
    difficulty: string;
    serving_size: string;
    calories_per_serving: string;
    dietary_info: string;
    ingredients: Ingredient[];
    not_included_in_delivery?: Ingredient[];
    cooking_steps: CookingStep[];
    nutrition_values: NutritionValues;
    tags: string[];
    image_url: string; // "images/dish/..."
    cousine: string;
}
