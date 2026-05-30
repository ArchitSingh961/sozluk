import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Download from '@/lib/models/Download';
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
    const download = await Download.findByIdAndDelete(id);
    
    if (!download) {
      return NextResponse.json({ error: 'Download not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Download deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
