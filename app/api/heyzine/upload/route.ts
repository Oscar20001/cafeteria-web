import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Menu from '@/models/Menu';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const file = formData.get('pdf') as File;
    const menuId = formData.get('menuId') as string;

    if (!file || !menuId) {
      return NextResponse.json(
        { error: 'Falta el archivo PDF o el ID del menú' },
        { status: 400 }
      );
    }

    // 1. Preparar el FormData para Heyzine
    const heyzineFormData = new FormData();
    heyzineFormData.append('pdf', file);
    // Si Heyzine requiere el filename explícitamente:
    // heyzineFormData.append('filename', file.name);

    // 2. Llamar a la API de Heyzine
    // Intentamos usar la variable de entorno, si no existe, usamos la clave proporcionada como respaldo
    const apiKey = process.env.HEYZINE_API_KEY || 'd475481b4f990c70dee6875ec8e24c7beceaae1d.09f5459c8dfa0a1a';
    
    if (!apiKey) {
      console.error('HEYZINE_API_KEY no está definida');
      return NextResponse.json(
        { error: 'Configuración de servidor incompleta (Falta API Key)' },
        { status: 500 }
      );
    }

    // URL correcta para subir PDF a Heyzine: https://heyzine.com/api/1/pdf
    // NOTA: Algunas versiones de la API de Heyzine requieren que la key vaya en el body si es POST
    // Pero la documentación estándar dice query param.
    // Vamos a probar enviando la key TAMBIÉN en el FormData por si acaso.
    heyzineFormData.append('k', apiKey);

    const apiUrl = `https://heyzine.com/api/1/pdf?k=${apiKey}`;

    console.log('Iniciando subida a Heyzine...');
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: heyzineFormData,
    });

    console.log('Heyzine status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Heyzine error body:', errorText);
      
      // Si es 404, es probable que la URL esté mal o la API Key sea inválida para ese endpoint
      if (response.status === 404) {
         return NextResponse.json(
          { error: 'Error de conexión con Heyzine (Endpoint no encontrado o API Key inválida)' },
          { status: 502 }
        );
      }

      return NextResponse.json(
        { error: `Error al subir a Heyzine: ${response.status} - ${errorText}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    console.log('Heyzine success response:', data);
    
    const flipbookUrl = data.url || data.link || data.pdf_link; 

    if (!flipbookUrl) {
      console.error('Respuesta sin URL:', data);
      return NextResponse.json(
        { error: 'La respuesta de Heyzine no contenía una URL válida' },
        { status: 502 }
      );
    }

    // 3. Guardar en la base de datos
    // Usamos findOneAndUpdate con upsert: true para crear si no existe
    const updatedMenu = await Menu.findOneAndUpdate(
      { menuId },
      { 
        menuId,
        heyzineUrl: flipbookUrl,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ 
      success: true, 
      menu: updatedMenu 
    });

  } catch (error) {
    console.error('Error en upload:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
