import mongoose from 'mongoose';

const GalleryItemSchema = new mongoose.Schema({
  title: String,
  image: { type: String, required: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.GalleryItem || mongoose.model('GalleryItem', GalleryItemSchema);
