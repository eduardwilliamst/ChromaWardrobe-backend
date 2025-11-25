import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import axios from 'axios';

/**
 * Proxy Pinterest API search requests
 * POST /api/pinterest/search
 * Body: { query: string, limit?: number }
 */
export const searchPinterest = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array()
      });
      return;
    }

    const { query, limit = 20 } = req.body;

    const pinterestAccessToken = process.env.PINTEREST_ACCESS_TOKEN;

    if (!pinterestAccessToken) {
      res.status(500).json({
        success: false,
        message: 'Pinterest API is not configured. Please set PINTEREST_ACCESS_TOKEN in environment variables.'
      });
      return;
    }

    // Make request to Pinterest API
    // Note: This is a simplified example. The actual Pinterest API endpoint may vary.
    // You would need to use the official Pinterest API v5
    const response = await axios.get('https://api.pinterest.com/v5/search/pins', {
      headers: {
        'Authorization': `Bearer ${pinterestAccessToken}`,
        'Content-Type': 'application/json'
      },
      params: {
        query,
        limit
      },
      timeout: 10000 // 10 second timeout
    });

    res.status(200).json({
      success: true,
      data: response.data,
      query,
      source: 'Pinterest API'
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle API errors
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message;

      res.status(statusCode).json({
        success: false,
        message: 'Pinterest API request failed',
        error: errorMessage
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error searching Pinterest',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};

/**
 * Get Pinterest board pins (if needed)
 * POST /api/pinterest/board
 * Body: { boardId: string, limit?: number }
 */
export const getBoardPins = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array()
      });
      return;
    }

    const { boardId, limit = 20 } = req.body;

    const pinterestAccessToken = process.env.PINTEREST_ACCESS_TOKEN;

    if (!pinterestAccessToken) {
      res.status(500).json({
        success: false,
        message: 'Pinterest API is not configured. Please set PINTEREST_ACCESS_TOKEN in environment variables.'
      });
      return;
    }

    const response = await axios.get(`https://api.pinterest.com/v5/boards/${boardId}/pins`, {
      headers: {
        'Authorization': `Bearer ${pinterestAccessToken}`,
        'Content-Type': 'application/json'
      },
      params: {
        page_size: limit
      },
      timeout: 10000
    });

    res.status(200).json({
      success: true,
      data: response.data,
      boardId,
      source: 'Pinterest API'
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message;

      res.status(statusCode).json({
        success: false,
        message: 'Pinterest API request failed',
        error: errorMessage
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error fetching Pinterest board',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};
