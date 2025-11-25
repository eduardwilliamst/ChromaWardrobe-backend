import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  color: string;
  category: 'top' | 'bottom' | 'dress';
  material: string;
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'all-season';
  occasion: 'casual' | 'formal' | 'business' | 'party' | 'athletic';
  image_url: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Product name must be at least 2 characters'],
      maxlength: [100, 'Product name must not exceed 100 characters']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number']
    },
    color: {
      type: String,
      required: [true, 'Color is required'],
      validate: {
        validator: function(v: string) {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
        },
        message: 'Color must be a valid HEX code (e.g., #FF5733)'
      }
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['top', 'bottom', 'dress'],
        message: 'Category must be one of: top, bottom, dress'
      }
    },
    material: {
      type: String,
      required: [true, 'Material is required'],
      trim: true
    },
    season: {
      type: String,
      required: [true, 'Season is required'],
      enum: {
        values: ['spring', 'summer', 'fall', 'winter', 'all-season'],
        message: 'Season must be one of: spring, summer, fall, winter, all-season'
      }
    },
    occasion: {
      type: String,
      required: [true, 'Occasion is required'],
      enum: {
        values: ['casual', 'formal', 'business', 'party', 'athletic'],
        message: 'Occasion must be one of: casual, formal, business, party, athletic'
      }
    },
    image_url: {
      type: String,
      required: [true, 'Image URL is required'],
      validate: {
        validator: function(v: string) {
          return /^https?:\/\/.+/.test(v);
        },
        message: 'Image URL must be a valid URL'
      }
    }
  },
  {
    timestamps: true
  }
);

// Indexes for common queries
ProductSchema.index({ category: 1 });
ProductSchema.index({ color: 1 });
ProductSchema.index({ category: 1, color: 1 });
ProductSchema.index({ occasion: 1 });
ProductSchema.index({ season: 1 });

export default mongoose.model<IProduct>('Product', ProductSchema);
