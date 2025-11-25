import mongoose, { Document, Schema } from 'mongoose';

export interface ISavedOutfit {
  items: mongoose.Types.ObjectId[];
  createdAt: Date;
}

export interface IUser extends Document {
  email: string;
  saved_outfits: ISavedOutfit[];
  createdAt: Date;
  updatedAt: Date;
}

const SavedOutfitSchema: Schema = new Schema({
  items: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function(v: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please provide a valid email address'
      }
    },
    saved_outfits: [SavedOutfitSchema]
  },
  {
    timestamps: true
  }
);

// Index for email lookup
UserSchema.index({ email: 1 });

export default mongoose.model<IUser>('User', UserSchema);
