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

    // 1. Subir a almacenamiento temporal (catbox.moe)
    // Heyzine requiere una URL pública. Usamos catbox.moe que es fiable y devuelve enlace directo.
    console.log('Subiendo a almacenamiento temporal (catbox.moe)...');
    const tempUploadFormData = new FormData();
    tempUploadFormData.append('reqtype', 'fileupload');
    tempUploadFormData.append('fileToUpload', file);

    const tempUploadResponse = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: tempUploadFormData,
    });

    if (!tempUploadResponse.ok) {
      console.error('Error catbox:', await tempUploadResponse.text());
      return NextResponse.json(
        { error: 'Error al procesar el archivo temporalmente' },
        { status: 502 }
      );
    }

    const pdfUrl = await tempUploadResponse.text();
    
    if (!pdfUrl.startsWith('http')) {
       console.error('Error catbox response:', pdfUrl);
       return NextResponse.json(
        { error: 'Error al obtener URL temporal del archivo' },
        { status: 502 }
      );
    }
    
    console.log('PDF URL temporal generada:', pdfUrl);

    // 2. Llamar a la API de Heyzine
    const apiKey = process.env.HEYZINE_API_KEY || 'd475481b4f990c70dee6875ec8e24c7beceaae1d.09f5459c8dfa0a1a';
    
    if (!apiKey) {
      console.error('HEYZINE_API_KEY no está definida');
      return NextResponse.json(
        { error: 'Configuración de servidor incompleta (Falta API Key)' },
        { status: 500 }
      );
    }

    // Endpoint correcto: https://heyzine.com/api1/rest
    // Parámetros: k (api key), pdf (url del pdf)
    const heyzineUrl = `https://heyzine.com/api1/rest?k=${apiKey}&pdf=${encodeURIComponent(pdfUrl)}`;

    console.log('Iniciando conversión en Heyzine...');
    
    const response = await fetch(heyzineUrl, {
      method: 'POST',
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
    
    if (data.error) {
      return NextResponse.json(
        { error: `Heyzine reportó un error: ${data.error}` },
        { status: 502 }
      );
    }

    const flipbookUrl = data.url || data.link || data.pdf_link; 

    if (!flipbookUrl) {
      console.error('Respuesta sin URL:', data);
      return NextResponse.json(
        { error: `Respuesta inesperada de Heyzine: ${JSON.stringify(data)}` },
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
