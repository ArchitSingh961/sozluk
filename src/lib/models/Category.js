import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  image: { type: String },
  description: { type: String },
  order: { type: Number, default: 0 }
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
