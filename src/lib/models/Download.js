import mongoose from 'mongoose';

const DownloadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  fileUrl: { type: String, required: true },
  fileSize: { type: String },
  icon: { type: String, default: '📄' },
  type: { type: String, enum: ['catalogue', 'technical', 'cad'] },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Download || mongoose.model('Download', DownloadSchema);
