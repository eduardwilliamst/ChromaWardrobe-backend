import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Product, { IProduct } from '../models/Product';
import { areColorsCompatible } from '../utils/colorMatcher';

interface OutfitSuggestion {
  product: IProduct;
  matchScore: number;
  matchReasons: string[];
}

/**
 * Suggest compatible items for outfit creation
 * POST /api/outfits/suggest
 * Body: { productId: string }
 */
export const suggestOutfit = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array()
      });
      return;
    }

    const { productId } = req.body;

    // Find the selected product
    const selectedProduct = await Product.findById(productId);

    if (!selectedProduct) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    // Determine which categories to search for based on selected item
    let targetCategories: string[] = [];

    if (selectedProduct.category === 'top') {
      targetCategories = ['bottom', 'dress'];
    } else if (selectedProduct.category === 'bottom') {
      targetCategories = ['top', 'dress'];
    } else if (selectedProduct.category === 'dress') {
      // Dresses are complete outfits, but we can suggest accessories or alternative dresses
      targetCategories = ['dress'];
    }

    // Find all products in target categories
    const candidateProducts = await Product.find({
      category: { $in: targetCategories },
      _id: { $ne: selectedProduct._id } // Exclude the selected product
    });

    // Score and filter compatible products
    const suggestions: OutfitSuggestion[] = [];

    for (const candidate of candidateProducts) {
      const matchReasons: string[] = [];
      let matchScore = 0;

      // 1. Color compatibility (most important) - 50 points
      const colorCompatible = areColorsCompatible(
        selectedProduct.color,
        candidate.color,
        30 // threshold
      );

      if (colorCompatible) {
        matchScore += 50;
        matchReasons.push('Color harmony');
      }

      // 2. Category compatibility - 20 points
      if (
        (selectedProduct.category === 'top' && candidate.category === 'bottom') ||
        (selectedProduct.category === 'bottom' && candidate.category === 'top')
      ) {
        matchScore += 20;
        matchReasons.push('Perfect category pairing');
      }

      // 3. Season compatibility - 15 points
      if (
        selectedProduct.season === candidate.season ||
        selectedProduct.season === 'all-season' ||
        candidate.season === 'all-season'
      ) {
        matchScore += 15;
        matchReasons.push('Season match');
      }

      // 4. Occasion compatibility - 15 points
      if (selectedProduct.occasion === candidate.occasion) {
        matchScore += 15;
        matchReasons.push('Same occasion');
      }

      // Only suggest items with at least color compatibility
      if (matchScore >= 50) {
        suggestions.push({
          product: candidate,
          matchScore,
          matchReasons
        });
      }
    }

    // Sort by match score (highest first)
    suggestions.sort((a, b) => b.matchScore - a.matchScore);

    // Limit to top 10 suggestions
    const topSuggestions = suggestions.slice(0, 10);

    res.status(200).json({
      success: true,
      selectedProduct: {
        id: selectedProduct._id,
        name: selectedProduct.name,
        category: selectedProduct.category,
        color: selectedProduct.color
      },
      suggestions: topSuggestions,
      totalFound: suggestions.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating outfit suggestions',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get color compatibility info for a specific product
 * GET /api/outfits/color-compatibility/:id
 */
export const getColorCompatibility = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array()
      });
      return;
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
      return;
    }

    // Import color harmony functions
    const { getCompatibleColors } = await import('../utils/colorMatcher');
    const harmonies = getCompatibleColors(product.color);

    res.status(200).json({
      success: true,
      product: {
        id: product._id,
        name: product.name,
        color: product.color
      },
      colorHarmonies: harmonies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching color compatibility',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
