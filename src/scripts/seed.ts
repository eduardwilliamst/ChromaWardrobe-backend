import dotenv from 'dotenv';
import Product from '../models/Product';
import { connectDatabase } from '../config/database';

dotenv.config();

const sampleProducts = [
  // Tops
  {
    name: 'Classic White Button-Up Shirt',
    price: 49.99,
    color: '#FFFFFF',
    category: 'top',
    material: 'Cotton',
    season: 'all-season',
    occasion: 'business',
    image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400'
  },
  {
    name: 'Navy Blue Blazer',
    price: 129.99,
    color: '#000080',
    category: 'top',
    material: 'Wool Blend',
    season: 'fall',
    occasion: 'formal',
    image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400'
  },
  {
    name: 'Casual Gray T-Shirt',
    price: 24.99,
    color: '#808080',
    category: 'top',
    material: 'Cotton',
    season: 'all-season',
    occasion: 'casual',
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'
  },
  {
    name: 'Coral Pink Blouse',
    price: 59.99,
    color: '#FF7F50',
    category: 'top',
    material: 'Silk',
    season: 'spring',
    occasion: 'casual',
    image_url: 'https://images.unsplash.com/photo-1564257577-50838a6c1cf3?w=400'
  },
  {
    name: 'Forest Green Sweater',
    price: 69.99,
    color: '#228B22',
    category: 'top',
    material: 'Merino Wool',
    season: 'winter',
    occasion: 'casual',
    image_url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400'
  },

  // Bottoms
  {
    name: 'Black Slim Fit Trousers',
    price: 79.99,
    color: '#000000',
    category: 'bottom',
    material: 'Polyester Blend',
    season: 'all-season',
    occasion: 'formal',
    image_url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400'
  },
  {
    name: 'Light Blue Denim Jeans',
    price: 89.99,
    color: '#ADD8E6',
    category: 'bottom',
    material: 'Denim',
    season: 'all-season',
    occasion: 'casual',
    image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'
  },
  {
    name: 'Beige Chino Pants',
    price: 64.99,
    color: '#F5F5DC',
    category: 'bottom',
    material: 'Cotton Twill',
    season: 'spring',
    occasion: 'business',
    image_url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400'
  },
  {
    name: 'Navy Blue Dress Pants',
    price: 94.99,
    color: '#000080',
    category: 'bottom',
    material: 'Wool',
    season: 'fall',
    occasion: 'formal',
    image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400'
  },
  {
    name: 'Khaki Cargo Shorts',
    price: 44.99,
    color: '#C3B091',
    category: 'bottom',
    material: 'Cotton',
    season: 'summer',
    occasion: 'casual',
    image_url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400'
  },

  // Dresses
  {
    name: 'Little Black Dress',
    price: 149.99,
    color: '#000000',
    category: 'dress',
    material: 'Polyester',
    season: 'all-season',
    occasion: 'party',
    image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'
  },
  {
    name: 'Floral Summer Dress',
    price: 79.99,
    color: '#FFB6C1',
    category: 'dress',
    material: 'Cotton',
    season: 'summer',
    occasion: 'casual',
    image_url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400'
  },
  {
    name: 'Burgundy Evening Gown',
    price: 249.99,
    color: '#800020',
    category: 'dress',
    material: 'Satin',
    season: 'fall',
    occasion: 'formal',
    image_url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400'
  },
  {
    name: 'Mint Green Sundress',
    price: 69.99,
    color: '#98FF98',
    category: 'dress',
    material: 'Linen',
    season: 'spring',
    occasion: 'casual',
    image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'
  },
  {
    name: 'Red Cocktail Dress',
    price: 189.99,
    color: '#DC143C',
    category: 'dress',
    material: 'Velvet',
    season: 'winter',
    occasion: 'party',
    image_url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400'
  }
];

async function seedDatabase(): Promise<void> {
  try {
    console.log('Starting database seed...\n');

    // Connect to database
    await connectDatabase();

    // Clear existing products
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    console.log('✓ Existing products cleared\n');

    // Insert sample products
    console.log('Inserting sample products...');
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`✓ Successfully inserted ${insertedProducts.length} products\n`);

    // Display inserted products
    console.log('Inserted Products:');
    console.log('==================');
    insertedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   ID: ${product._id}`);
      console.log(`   Category: ${product.category} | Color: ${product.color} | Price: $${product.price}`);
      console.log(`   Season: ${product.season} | Occasion: ${product.occasion}`);
      console.log('');
    });

    console.log('Database seeding completed successfully!');
    console.log('You can now start the server with: npm run dev');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
