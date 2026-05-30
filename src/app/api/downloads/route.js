import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Download from '@/lib/models/Download';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request) {
  try {
    await connectDB();
    const downloads = await Download.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ downloads }, { status: 200 });
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
    const download = await Download.create(data);
    return NextResponse.json({ download }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
