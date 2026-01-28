import os
import json
import re

def merge_recipes():
    recipes_dir = r"c:\Users\alien51\Documents\AI-Engineer\culinairy-genai\recipes"
    output_file = r"c:\Users\alien51\Documents\AI-Engineer\culinairy-genai\recipe-viewer\src\data\recipes.json"
    
    all_recipes = []
    
    files = [f for f in os.listdir(recipes_dir) if f.endswith('.json')]
    print(f"Found {len(files)} JSON files.")
    
    for filename in files:
        file_path = os.path.join(recipes_dir, filename)
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                recipe = json.load(f)
                
                # Generate an ID from the filename if not present
                if 'id' not in recipe:
                    # Remove '-extracted.json' and make lowercase, replace spaces/hyphens with underscores
                    recipe_id = filename.lower().replace('-extracted.json', '').replace(' ', '_').replace('-', '_')
                    recipe['id'] = recipe_id
                
                all_recipes.append(recipe)
        except Exception as e:
            print(f"Error processing {filename}: {e}")
            
    output_data = {"recipes": all_recipes}
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully merged {len(all_recipes)} recipes into {output_file}")

if __name__ == "__main__":
    merge_recipes()
