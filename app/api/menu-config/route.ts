import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Menu from '@/models/Menu';
import { MenuKey } from '@/types/menu';

export async function GET() {
  try {
    await dbConnect();
    const menus = await Menu.find({});
    
    // Transform database documents to MenuConfig format
    const config = menus.map(m => ({
      key: m.menuId as MenuKey,
      label: m.name,
      heyzineUrl: m.heyzineUrl || ''
    }));

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching menu config:', error);
    return NextResponse.json(
      { error: 'Error al obtener la configuración del menú' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { key, heyzineUrl } = body;

    if (!key) {
      return NextResponse.json(
        { error: 'La llave del menú es requerida' },
        { status: 400 }
      );
    }

    // Upsert the menu configuration
    // We use the key as menuId to maintain consistency with the existing model
    const updatedMenu = await Menu.findOneAndUpdate(
      { menuId: key },
      { 
        menuId: key,
        heyzineUrl: heyzineUrl,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, menu: updatedMenu });
  } catch (error) {
    console.error('Error updating menu config:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la configuración del menú' },
      { status: 500 }
    );
  }
}
