import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Inquiry from '@/lib/models/Inquiry';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { sendInquiryEmail } from '@/lib/mailer';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const inquiries = await Inquiry.find().sort({ createdAt: -1 }).populate('product');
    return NextResponse.json({ inquiries }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const inquiry = await Inquiry.create(data);
    
    // Send email notification asynchronously
    sendInquiryEmail(data).catch(err => {
      console.error('Failed to send inquiry email:', err);
    });

    return NextResponse.json({ success: true, inquiry }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
