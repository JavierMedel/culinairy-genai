# Project Analysis Summary

## Project Type
Recipe data processing & image downloader

## Tech Stack
Python 3 with the following libraries:
- `requests` - HTTP library for downloading images
- `json` - JSON parsing and serialization
- `os` - File system operations
- `urllib.parse` - URL parsing utilities

## File Structure
```
project/
├── download_and_update_recipes.py  # Main script
├── download_recipe_images.py       # Alternative version
├── recipes.json                    # Original data (22 recipes)
├── recipes_updated.json            # Updated with local paths
└── images/                         # 310 images total
    ├── dish/                       # 21 images
    ├── ingredient/                 # 163 images
    └── cooking_step/               # 126 images
```

## Purpose
Downloads HelloFresh recipe images from URLs and updates JSON to use local file paths instead of remote URLs. Each recipe contains dish images, ingredient images with allergen info, and step-by-step cooking images.

## Main Components

### download_and_update_recipes.py (Primary module)
- Downloads recipe images from HelloFresh API
- Updates JSON data with local image paths
- Key functions:
  - `ensure_dir()` - Creates necessary directories
  - `get_filename_from_url()` - Extracts clean filenames from URLs
  - `download_image()` - Downloads images with error handling and skipping logic
  - `main()` - Orchestrates the entire pipeline

### download_recipe_images.py (Alternative/older version)
- Similar functionality to the main module
- Focuses on downloading ingredient and cooking step images
- No main dish image processing

## Data Structure

The JSON contains **22 recipes** with comprehensive cooking information:

### Recipe Schema
- **Basic info**: `id`, `title`, `subtitle`, `description`
- **Timing**: `prep_time`, `cooking_time`, `total_time`
- **Metadata**: `servings`, `difficulty`, `serving_size`, `calories_per_serving`
- **Dietary info**: `dietary_info` (allergens and facility processing notes)
- **Main image**: `image_url` (dish image - 21 images)
- **Ingredients**: Array of ingredients with:
  - `name`, `quantity`, `allergens` array, `image_url`
  - 163 ingredient images stored locally
- **Cooking steps**: Array of preparation steps with:
  - `image_url`
  - 126 cooking step images stored locally
- **Additional ingredients**: `not_included_in_delivery` section

## Key Functionality

The project is a **Recipe Data Manager** that:
1. Scrapes/imports recipe data from HelloFresh
2. Downloads all associated images (dishes, ingredients, cooking steps)
3. Updates JSON URLs from remote (HTTP) to local file paths
4. Maintains organized image structure with three subdirectories
5. Handles duplicate downloads efficiently (skips existing files)
6. Provides error handling and logging for failed downloads

This is a **data processing and asset management project** designed to create an offline-capable recipe database with all media content locally stored.
