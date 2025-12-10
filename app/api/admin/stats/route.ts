import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Reservation from '@/models/Reservation';

export async function GET() {
  try {
    await dbConnect();
    
    const now = new Date();
    
    // Start and End of Today
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    
    // Start and End of Week
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 7);
    
    // Start and End of Month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const dailyCount = await Reservation.countDocuments({
      date: { $gte: startOfDay, $lt: endOfDay }
    });

    const weeklyCount = await Reservation.countDocuments({
      date: { $gte: startOfWeek, $lt: endOfWeek }
    });

    const monthlyCount = await Reservation.countDocuments({
      date: { $gte: startOfMonth, $lt: endOfMonth }
    });

    return NextResponse.json({ 
      success: true, 
      data: { daily: dailyCount, weekly: weeklyCount, monthly: monthlyCount } 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
