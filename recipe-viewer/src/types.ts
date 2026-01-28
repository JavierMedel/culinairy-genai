export interface Ingredient {
    name: string;
    amount: string;
    image_url: string;
    allergens_info?: string;
}

export interface CookingStep {
    number: number;
    instructions: string[];
    image_url: string;
}

export interface Recipe {
    id: string;
    title: string;
    subtitle?: string;
    description: string;
    prep_time?: string;
    cook_time?: string;
    total_time?: string; // May need to be derived or made optional
    servings?: string;
    difficulty?: string;
    serving_size?: string;
    calories_per_serving?: string;
    ingredients_summary?: string;
    tags?: string[];
    allergens?: string[];
    ingredients: Ingredient[];
    not_included?: Ingredient[];
    nutrition?: Record<string, string>;
    utensils?: string[];
    steps: CookingStep[];
    image_url: string; // URL from HelloFresh
    cousine?: string;
}

