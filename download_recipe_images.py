import os
import json
import requests
from urllib.parse import urlparse

# -------- CONFIG --------
JSON_FILE = "recipes.json"  # Path to your JSON file
INGREDIENT_DIR = "images/ingredient"
COOKING_STEP_DIR = "images/cooking_step"
NOT_INCLUDED_DIR = "images/ingredient"  # same as ingredients, if preferred

# -------- UTILITIES --------
def ensure_dir(path):
    """Ensure the directory exists."""
    os.makedirs(path, exist_ok=True)

def get_filename_from_url(url):
    """Extract the filename (without HelloFresh params) from URL."""
    parsed = urlparse(url)
    filename = os.path.basename(parsed.path)
    return filename

def download_image(url, save_path):
    """Download and save image."""
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

    # Load JSON data
    with open(JSON_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    for recipe in data.get("recipes", []):
        recipe_id = recipe.get("id")
        print(f"\n📖 Processing recipe: {recipe_id}")

        # ---------- INGREDIENT IMAGES ----------
        for section in ["ingredients", "not_included_in_delivery"]:
            for item in recipe.get(section, []):
                url = item.get("image_url")
                if url:
                    filename = get_filename_from_url(url)
                    save_path = os.path.join(INGREDIENT_DIR, filename)
                    download_image(url, save_path)

        # ---------- COOKING STEP IMAGES ----------
        for step in recipe.get("cooking_steps", []):
            url = step.get("image_url")
            if url:
                filename = get_filename_from_url(url)
                save_path = os.path.join(COOKING_STEP_DIR, filename)
                download_image(url, save_path)

if __name__ == "__main__":
    main()
