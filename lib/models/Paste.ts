
import mongoose, { Schema, Document } from 'mongoose';

export interface IPaste extends Document {
  content: string;
  slug: string;
  views: number;
  maxViews?: number;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PasteSchema = new Schema<IPaste>({
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  maxViews: {
    type: Number,
    min: [1, 'Max views must be at least 1'],
  },
  expiresAt: {
    type: Date,
    index: true,
  },
}, {
  timestamps: true,
});

// Check if paste is available
PasteSchema.methods.isAvailable = function(): boolean {
  const now = new Date();
  
  // Debug logging
  console.log('\n🔍 Checking paste availability:');
  console.log('  Paste ID:', this.slug);
  console.log('  Current time:', now.toISOString());
  console.log('  Expires at:', this.expiresAt ? this.expiresAt.toISOString() : 'Never');
  console.log('  Views:', this.views);
  console.log('  Max views:', this.maxViews || 'Unlimited');
  
  // Check expiry
  if (this.expiresAt) {
    const expiryDate = new Date(this.expiresAt);
    const timeDifference = expiryDate.getTime() - now.getTime();
    const secondsDifference = Math.floor(timeDifference / 1000);
    
    console.log('  Time until expiry:', {
      milliseconds: timeDifference,
      seconds: secondsDifference,
      minutes: Math.floor(secondsDifference / 60),
      hours: Math.floor(secondsDifference / 3600)
    });
    
    if (timeDifference <= 0) {
      console.log('  ❌ Paste has expired!');
      return false;
    } else {
      console.log(`  ✅ Paste expires in ${secondsDifference} seconds`);
    }
  } else {
    console.log('  ✅ No expiry set');
  }
  
  // Check view limit
  if (this.maxViews && this.maxViews > 0) {
    if (this.views >= this.maxViews) {
      console.log(`  ❌ Reached view limit (${this.views}/${this.maxViews})`);
      return false;
    } else {
      const remaining = this.maxViews - this.views;
      console.log(`  ✅ ${remaining} views remaining`);
    }
  } else {
    console.log('  ✅ No view limit');
  }
  
  return true;
};

// Increment views
PasteSchema.methods.incrementViews = async function(): Promise<void> {
  console.log(`📈 Incrementing views: ${this.slug} (${this.views} → ${this.views + 1})`);
  this.views += 1;
  await this.save();
};

// Create TTL index for automatic cleanup
PasteSchema.index({ expiresAt: 1 }, { 
  expireAfterSeconds: 0,
  background: true,
  name: 'expiresAt_ttl_index'
});

export const Paste = mongoose.models.Paste || mongoose.model<IPaste>('Paste', PasteSchema);