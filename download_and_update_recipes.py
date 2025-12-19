import os
import json
import requests
from urllib.parse import urlparse

# -------- CONFIG --------
JSON_FILE = "recipes.json"               # Original JSON
UPDATED_JSON_FILE = "recipes_updated.json"  # Output JSON

# Image folders
INGREDIENT_DIR = "images/ingredient"
COOKING_STEP_DIR = "images/cooking_step"
DISH_DIR = "images/dish"

# -------- UTILITIES --------
def ensure_dir(path):
    """Ensure directory exists."""
    os.makedirs(path, exist_ok=True)

def get_filename_from_url(url):
    """Extract clean filename from a HelloFresh URL."""
    parsed = urlparse(url)
    return os.path.basename(parsed.path)

def download_image(url, save_path):
    """Download image if not already present."""
    if os.path.exists(save_path):
        print(f"⚡ Skipping (exists): {save_path}")
        return
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        with open(save_path, "wb") as f:
            f.write(response.content)
        print(f"✅ Saved: {save_path}")
    except Exception as e:
        print(f"❌ Failed to download {url}: {e}")

# -------- MAIN SCRIPT --------
def main():
    # Create directories
    ensure_dir(INGREDIENT_DIR)
    ensure_dir(COOKING_STEP_DIR)
    ensure_dir(DISH_DIR)

    # Load JSON data
    with open(JSON_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    for recipe in data.get("recipes", []):
        recipe_id = recipe.get("id")
        print(f"\n📖 Processing recipe: {recipe_id}")

        # ---- Main Dish Image ----
        dish_url = recipe.get("image_url")
        if dish_url:
            dish_filename = get_filename_from_url(dish_url)
            dish_local_path = os.path.join(DISH_DIR, dish_filename)
            download_image(dish_url, dish_local_path)
            recipe["image_url"] = dish_local_path.replace("\\", "/")

        # ---- Ingredients + Not Included ----
        for section in ["ingredients", "not_included_in_delivery"]:
            for item in recipe.get(section, []):
                url = item.get("image_url")
                if not url:
                    continue
                filename = get_filename_from_url(url)
                local_path = os.path.join(INGREDIENT_DIR, filename)
                download_image(url, local_path)
                item["image_url"] = local_path.replace("\\", "/")

        # ---- Cooking Steps ----
        for step in recipe.get("cooking_steps", []):
            url = step.get("image_url")
            if not url:
                continue
            filename = get_filename_from_url(url)
            local_path = os.path.join(COOKING_STEP_DIR, filename)
            download_image(url, local_path)
            step["image_url"] = local_path.replace("\\", "/")

    # ---- Save updated JSON ----
    with open(UPDATED_JSON_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\n🎉 Updated JSON saved as: {UPDATED_JSON_FILE}")

if __name__ == "__main__":
    main()
