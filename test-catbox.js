const fs = require('fs');

async function upload() {
  const filePath = './dummy.pdf';
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, 'Dummy PDF Content');
  }
  
  const formData = new FormData();
  const fileBuffer = fs.readFileSync(filePath);
  const blob = new Blob([fileBuffer], { type: 'application/pdf' });
  
  formData.append('reqtype', 'fileupload');
  formData.append('fileToUpload', blob, 'dummy.pdf');

  const url = `https://catbox.moe/user/api.php`;
  
  console.log('Uploading to:', url);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    
    console.log('Status:', response.status);
    const text = await response.text();
    console.log('Response:', text);

  } catch (error) {
    console.error('Error:', error);
  }
}

upload();