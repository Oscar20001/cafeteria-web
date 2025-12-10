import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Reservation from '@/models/Reservation';

export async function GET() {
  try {
    await dbConnect();
    const reservations = await Reservation.find({}).sort({ date: 1, time: 1 });
    return NextResponse.json({ success: true, data: reservations });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    await dbConnect();
    const { id, status } = await request.json();
    const reservation = await Reservation.findByIdAndUpdate(id, { status }, { new: true });
    return NextResponse.json({ success: true, data: reservation });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.email || !body.phone || !body.date || !body.time || !body.guests) {
      return NextResponse.json({ success: false, error: 'Todos los campos son requeridos' }, { status: 400 });
    }

    const reservation = await Reservation.create(body);
    return NextResponse.json({ success: true, data: reservation }, { status: 201 });
  } catch (error) {
    console.error('Reservation Error:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
