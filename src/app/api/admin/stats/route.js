import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';
import Download from '@/lib/models/Download';
import GalleryItem from '@/lib/models/GalleryItem';
import Inquiry from '@/lib/models/Inquiry';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const [products, categories, downloads, galleryItems, inquiries] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Download.countDocuments(),
      GalleryItem.countDocuments(),
      Inquiry.countDocuments(),
    ]);

    return NextResponse.json({
      stats: { products, categories, downloads, galleryItems, inquiries }
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
