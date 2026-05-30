import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  series: { type: String, enum: ['31mm-sliding', '41mm-casement'] },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  weight: String,
  dimensions: String,
  description: String,
  image: String,
  technicalDrawing: String,
  pdfUrl: String,
  order: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
