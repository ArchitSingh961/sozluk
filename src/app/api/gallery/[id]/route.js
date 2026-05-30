import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GalleryItem from '@/lib/models/GalleryItem';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const item = await GalleryItem.findByIdAndDelete(id);
    
    if (!item) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Gallery item deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();
    const item = await GalleryItem.findByIdAndUpdate(id, data, { new: true });
    
    if (!item) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
    }
    
    return NextResponse.json({ item }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
