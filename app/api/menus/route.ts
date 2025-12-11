import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Menu from '@/models/Menu';

export async function GET() {
  try {
    await dbConnect();
    const menus = await Menu.find({});
    return NextResponse.json(menus);
  } catch (error) {
    console.error('Error fetching menus:', error);
    return NextResponse.json(
      { error: 'Error al obtener los menús' },
      { status: 500 }
    );
  }
}
