const fs = require('fs');

async function upload() {
  const filePath = './dummy.pdf';
  // Create dummy file if not exists
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, 'Dummy PDF Content');
  }
  
  const formData = new FormData();
  const fileBuffer = fs.readFileSync(filePath);
  const blob = new Blob([fileBuffer], { type: 'application/pdf' });
  
  formData.append('file', blob, 'dummy.pdf');

  const url = `https://file.io`;
  
  console.log('Uploading to:', url);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', data);
    
    if (data.success) {
        console.log('Direct URL:', data.link);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

upload();