// import { addFile, getFile } from '../../services/ipfs/ipfs.service.js';

// export async function uploadFile(req, res) {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }

//     const cid = await addFile(req.file);
    
//     return res.json({
//       success: true,
//       cid,
//       filename: req.file.originalname,
//       size: req.file.size
//     });
//   } catch (error) {
//     console.error('Upload error:', error);
//     return res.status(500).json({ error: 'Error uploading file' });
//   }
// }

// export async function retrieveFile(req, res) {
//   const { cid } = req.params;
//   try {
//     const buffer = await getFile(cid);
//     res.send(buffer)
//   } catch (err) {
//     console.error('Error while streaming file:', err);
//     res.status(500).send('Failed to retrieve file');
//   }
// }

export async function retrieveFile(req, res) {
  const { cid } = req.params;
  const { filename } = req.query; // Optional filename parameter
  
  try {
    const { content, filename: generatedFilename } = await getFile(cid, filename);
    
    // Set proper headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${generatedFilename}"`);
    
    // Send the file content
    res.send(content);
  } catch (err) {
    console.error('Error while retrieving file:', err);
    res.status(500).send('Failed to retrieve file');
  }
}