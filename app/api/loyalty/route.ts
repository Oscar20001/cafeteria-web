import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Loyalty from '@/models/Loyalty';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
  }

  try {
    await dbConnect();
    let loyalty = await Loyalty.findOne({ email });
    
    if (!loyalty) {
      // Return null if not found, frontend will handle registration
      return NextResponse.json({ success: true, data: null });
    }

    return NextResponse.json({ success: true, data: loyalty });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email, name, amount, action } = await request.json();

    // Handle Registration
    if (action === 'register') {
      if (!email || !name) {
        return NextResponse.json({ success: false, error: 'Email and Name are required' }, { status: 400 });
      }
      const loyalty = await Loyalty.create({ email, name, points: 0 });
      return NextResponse.json({ success: true, data: loyalty });
    }
    
    // Handle Adding Points (existing logic)
    if (!email || !amount) {
      return NextResponse.json({ success: false, error: 'Email and amount are required' }, { status: 400 });
    }

    const pointsEarned = Math.floor(amount / 10); // 1 point per $10

    let loyalty = await Loyalty.findOne({ email });

    if (!loyalty) {
       // If adding points to non-existent user, require name to create
       if (!name) return NextResponse.json({ success: false, error: 'User not found. Name required to create.' }, { status: 400 });
       loyalty = new Loyalty({ email, name });
    }

    loyalty.points += pointsEarned;
    loyalty.history.push({
      date: new Date(),
      amount,
      pointsEarned
    });

    await loyalty.save();

    return NextResponse.json({ success: true, data: loyalty });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
