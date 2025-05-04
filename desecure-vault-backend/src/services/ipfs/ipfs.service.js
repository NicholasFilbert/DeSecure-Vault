import { create } from 'kubo-rpc-client';
import crypto from 'crypto'

const client = create()

export const ipfsAddFile = async (base = 'Others', path='/', files, prevCid, duplicateHandler = null) => {
  const dirPath = `/${base}${path}`

  const filesCid = await Promise.all(
    files.map(async file => {
      let filename = file.originalname
      if(!!duplicateHandler){
        filename = duplicateHandler(filename)
      }
      let fullPath = `${dirPath}/${filename}`

      await client.files.write(
        fullPath,
        file.buffer,
        {
          create: true,
          parents: true,
          truncate: true
        }
      )
      const fileCid = await client.files.stat(fullPath)

      const hash = crypto.createHash('sha256').update(file.buffer).digest('hex');

      return {
        filename: filename,
        size: file.size,
        hash: hash,
        cid: fileCid.cid.toString() 
      }
    })
  )

  const dirCid = await client.files.flush('/'+base)

  await client.pin.add(dirCid, { recursive: true })

  if(!!prevCid){
    await client.pin.rm(prevCid, {recursive: true})
  }

  await client.repo.gc()
  
  return {
    "dirCid": dirCid.toString(),
    "filesCid": filesCid,
  }
};

export const ipfsGetFile = async (cid) => {
  const chunks = []
  for await (const chunk of client.cat(cid)) {
    chunks.push(chunk)
  }
  const fileBuffer = Buffer.concat(chunks)
  return fileBuffer
}

export const ipfsRenameFile = async (base = 'Others', path='/', prevName, newName  = 'Untitled File', prevCid, duplicateHandler = null) => {
  const dirPath = `/${base}${path}`
  const prevPath = `${dirPath}/${prevName}`
  if(!!duplicateHandler){
    newName = duplicateHandler(newName)
  }
  const newPath = `${dirPath}/${newName}`

  // console.log(prevPath)
  // console.log(newPath)

  await client.files.mv(prevPath, newPath)

  const dirCid = await client.files.flush('/' + base)

  await client.pin.add(dirCid, { recursive: true })

  if(!!prevCid){
    console.log(prevCid)
    await client.pin.rm(prevCid, {recursive: true})
  }

  await client.repo.gc()
  
  return {
    "dirCid": dirCid.toString(),
  }
}

export const ipfsDeleteFile = async (base = 'Others', path='/', filename, prevCid) => {
  const filePath = `/${base}${path}/${filename}`;
  
  try {
    await client.files.rm(filePath); // remove the file from MFS

    // flush the directory to get the new CID
    const newDirCid = await client.files.flush('/' + base);

    if(!!prevCid){
      await client.pin.rm(prevCid, {recursive: true})
    }

    await client.pin.add(newDirCid.toString())

    // Optional: garbage collect to clean old data
    await client.repo.gc();

    return {
      "dirCid": newDirCid.toString()
    };
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};


// export const getFile = async (cid, filename = 'download') => {
//   const cidStat = await client.files.stat(`/ipfs/${cid}`);
//   const isDir = cidStat.type === "directory";

//   if (isDir) {
//     // Create ZIP for directory
//     const zip = new JSZip();
//     await addDirectoryToZip(zip, cid, '');
    
//     // Generate ZIP as Node.js buffer
//     return {
//       content: await zip.generateAsync({ type: 'nodebuffer' }),
//       filename: `${filename}.zip`,
//       contentType: 'application/zip'
//     };
//   } else {
//     // Handle single file
//     const chunks = [];
//     for await (const chunk of client.cat(cid)) {
//       chunks.push(chunk);
//     }
//     const content = Buffer.concat(chunks);
    
//     return {
//       content,
//       filename
//     };
//   }
// };

// // Helper function to recursively add directory contents to ZIP
// const addDirectoryToZip = async (zip, cid, path) => {
//   for await (const entry of client.ls(cid)) {
//     const entryPath = path ? `${path}/${entry.name}` : entry.name;
    
//     if (entry.type === 'directory') {
//       await addDirectoryToZip(zip, entry.cid.toString(), entryPath);
//     } else {
//       const chunks = [];
//       for await (const chunk of client.cat(entry.cid)) {
//         chunks.push(chunk);
//       }
//       zip.file(entryPath, Buffer.concat(chunks));
//     }
//   }
// };