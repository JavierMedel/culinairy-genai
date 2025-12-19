import json
import os

def split_recipes():
    """Split recipes from recipes_updated.json into individual files."""

    # Create recipes directory if it doesn't exist
    os.makedirs('recipes', exist_ok=True)

    # Load the recipes_updated.json file
    with open('recipes_updated.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    recipes = data.get('recipes', [])

    # Save each recipe as an individual file
    for recipe in recipes:
        recipe_id = recipe.get('id')
        if recipe_id:
            filename = f"recipes/{recipe_id}.json"
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(recipe, f, indent=2, ensure_ascii=False)
            print(f"Saved: {filename}")
        else:
            print(f"Warning: Recipe without ID found, skipping")

    print(f"\nTotal recipes saved: {len(recipes)}")

if __name__ == "__main__":
    split_recipes()
