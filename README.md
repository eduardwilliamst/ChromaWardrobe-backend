# ChromaWardrobe Backend API

A Node.js + Express backend for a fashion outfit recommendation website with intelligent color matching and outfit suggestions.

## Features

- **Product Management**: CRUD operations for fashion products
- **Color Matching**: Advanced color theory-based compatibility system
  - Complementary colors
  - Analogous colors
  - Triadic colors
  - Neutral color support
- **Outfit Suggestions**: Smart algorithm to suggest compatible items
- **Pinterest Integration**: Proxy API for fashion inspiration searches
- **Rate Limiting**: Protection against API abuse
- **Input Validation**: Comprehensive request validation
- **MongoDB Integration**: Efficient data storage with Mongoose ODM
- **TypeScript**: Type-safe code throughout

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Validation**: express-validator
- **Color Processing**: color library
- **Rate Limiting**: express-rate-limit
- **CORS**: cors middleware

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   cd ChromaWardrobe-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```

   Edit `.env`:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/chromawardrobe
   CORS_ORIGIN=http://localhost:5173
   PINTEREST_ACCESS_TOKEN=your_pinterest_token_here
   ```

4. **Start MongoDB**

   Make sure MongoDB is running:
   ```bash
   # On Windows
   net start MongoDB

   # On macOS/Linux
   sudo systemctl start mongod
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## Project Structure

```
src/
├── config/
│   └── database.ts           # MongoDB connection configuration
├── controllers/
│   ├── productController.ts  # Product CRUD operations
│   ├── outfitController.ts   # Outfit suggestion logic
│   └── pinterestController.ts # Pinterest API proxy
├── middleware/
│   ├── errorHandler.ts       # Global error handling
│   └── validators.ts         # Request validation rules
├── models/
│   ├── Product.ts            # Product schema
│   └── User.ts               # User schema
├── routes/
│   ├── productRoutes.ts      # Product endpoints
│   ├── outfitRoutes.ts       # Outfit endpoints
│   └── pinterestRoutes.ts    # Pinterest endpoints
├── scripts/
│   └── seed.ts               # Database seeding script
├── utils/
│   └── colorMatcher.ts       # Color matching algorithms
└── server.ts                 # Application entry point
```

## API Endpoints

### Health Check
- `GET /health` - Check API status

### Products
- `GET /api/products` - Get all products (with pagination & filtering)
  - Query params: `page`, `limit`, `category`, `color`, `season`, `occasion`, `minPrice`, `maxPrice`
- `GET /api/products/:id` - Get single product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Outfits
- `POST /api/outfits/suggest` - Get outfit suggestions
  - Body: `{ "productId": "mongodb_id" }`
- `GET /api/outfits/color-compatibility/:id` - Get color harmony info

### Pinterest
- `POST /api/pinterest/search` - Search Pinterest
  - Body: `{ "query": "summer fashion", "limit": 20 }`
- `POST /api/pinterest/board` - Get Pinterest board pins
  - Body: `{ "boardId": "board_id", "limit": 20 }`

Rate limited to 30 requests per 15 minutes per IP.

## Example Requests

### Get Products with Filters
```bash
curl "http://localhost:3000/api/products?category=top&color=%23FFFFFF&page=1&limit=10"
```

### Get Outfit Suggestions
```bash
curl -X POST http://localhost:3000/api/outfits/suggest \
  -H "Content-Type: application/json" \
  -d '{"productId": "65a1b2c3d4e5f6g7h8i9j0k1"}'
```

### Create Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Summer Linen Shirt",
    "price": 45.99,
    "color": "#87CEEB",
    "category": "top",
    "material": "Linen",
    "season": "summer",
    "occasion": "casual",
    "image_url": "https://example.com/image.jpg"
  }'
```

## Color Matching Algorithm

The color matching system uses color theory principles:

1. **Complementary Colors**: Opposite on the color wheel (180°)
2. **Analogous Colors**: Adjacent on the color wheel (±30°)
3. **Triadic Colors**: Evenly spaced around the wheel (120°)
4. **Neutral Colors**: Low saturation colors that match everything

The system calculates color distance using the Delta E formula in LAB color space for accurate perceptual matching.

## Outfit Suggestion Algorithm

The outfit suggestion endpoint scores products based on:

- **Color Compatibility (50 points)**: Uses color theory matching
- **Category Pairing (20 points)**: Top + Bottom combinations
- **Season Match (15 points)**: Same season or all-season items
- **Occasion Match (15 points)**: Same occasion type

Only items scoring 50+ points (color compatible) are suggested.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment (development/production) | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/chromawardrobe |
| `CORS_ORIGIN` | Allowed CORS origin | * |
| `PINTEREST_ACCESS_TOKEN` | Pinterest API token | - |

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run seed` - Seed database with sample products

## Product Schema

```typescript
{
  name: string;           // Product name (2-100 chars)
  price: number;          // Price (positive number)
  color: string;          // HEX color code (e.g., #FF5733)
  category: 'top' | 'bottom' | 'dress';
  material: string;       // Material description
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'all-season';
  occasion: 'casual' | 'formal' | 'business' | 'party' | 'athletic';
  image_url: string;      // Valid URL to product image
}
```

## Error Handling

The API uses standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": []  // Validation errors (if applicable)
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

## Pinterest API Setup

To use Pinterest integration:

1. Create a Pinterest Developer account at https://developers.pinterest.com/
2. Create a new app
3. Generate an access token
4. Add the token to your `.env` file as `PINTEREST_ACCESS_TOKEN`

Note: Pinterest API v5 requires approval for production use.

## Development Tips

- Use MongoDB Compass to visualize your data
- Check `/api` endpoint for API documentation
- Use `/health` endpoint to verify server status
- All timestamps are automatically managed by Mongoose
- Enable NODE_ENV=development for detailed error stacks

## Production Deployment

1. Build the TypeScript code:
   ```bash
   npm run build
   ```

2. Set environment variables:
   ```bash
   export NODE_ENV=production
   export MONGODB_URI=your_production_mongodb_uri
   ```

3. Start the server:
   ```bash
   npm start
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC

## Support

For issues and questions, please create an issue in the GitHub repository.

## Future Enhancements

- [ ] User authentication with JWT
- [ ] Save/favorite outfits
- [ ] Image upload functionality
- [ ] Advanced filtering with multiple colors
- [ ] Recommendation algorithm improvements
- [ ] Integration with fashion APIs (Zalando, ASOS)
- [ ] Virtual wardrobe management
- [ ] Style preference learning