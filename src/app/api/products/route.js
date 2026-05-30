import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

import Category from '@/lib/models/Category';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const featured = searchParams.get('featured');
    
    let query = {};
    if (featured === 'true') query.featured = true;

    if (categorySlug && categorySlug !== 'all') {
      const category = await Category.findOne({ slug: categorySlug });
      if (category) {
        const children = await Category.find({ parent: category._id });
        const categoryIds = [category._id, ...children.map(c => c._id)];
        query.category = { $in: categoryIds };
      } else {
        query.category = null; // No matching category found
      }
    }

    const products = await Product.find(query).sort({ order: 1, createdAt: -1 }).populate('category');
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();
    const product = await Product.create(data);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
