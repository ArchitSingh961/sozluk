import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AdminUser from '@/lib/models/AdminUser';
import Category from '@/lib/models/Category';
import Product from '@/lib/models/Product';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    await connectDB();

    // 1. Create Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@sozluk.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const adminExists = await AdminUser.findOne({ email: adminEmail });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await AdminUser.create({
        email: adminEmail,
        password: hashedPassword,
        name: 'Super Admin'
      });
    }

    // 2. Create Categories
    await Category.deleteMany({});
    const slidingCat = await Category.create({ name: '31 MM Sliding Series', slug: '31mm-sliding', order: 1 });
    const casementCat = await Category.create({ name: '41 MM Casement Series', slug: '41mm-casement', order: 2 });

    // 3. Create Sample Products
    await Product.deleteMany({});
    await Product.create([
      {
        name: '2 Track Outer Frame',
        code: 'SL-31-001',
        series: '31mm-sliding',
        category: slidingCat._id,
        weight: '0.450 kg/m',
        dimensions: '31 x 22 mm',
        description: 'Standard 2-track outer frame for sliding windows.',
        image: '/images/sliding.png',
        featured: true,
        order: 1
      },
      {
        name: 'Outer Frame',
        code: 'CS-41-001',
        series: '41mm-casement',
        category: casementCat._id,
        weight: '0.550 kg/m',
        dimensions: '41 x 35 mm',
        description: 'Heavy duty outer frame for casement systems.',
        image: '/images/casement.png',
        featured: true,
        order: 1
      }
    ]);

    return NextResponse.json({ message: 'Seed successful' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
