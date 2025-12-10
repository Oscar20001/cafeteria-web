import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Basic validation
    if (!body.customerName || !body.phone || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Faltan datos requeridos o el carrito está vacío' },
        { status: 400 }
      );
    }

    const order = await Order.create(body);
    
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error('Order Creation Error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
    try {
        await dbConnect();
        const orders = await Order.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: orders });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}
