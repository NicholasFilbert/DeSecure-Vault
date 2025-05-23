import { executeQuery, getQuery } from "../../utils/db.js";
import { clientErrorMessage, errorMessage, successMessage } from "../../utils/message.js";
import { ipfsAddFile, ipfsDeleteFile, ipfsGetFile, ipfsRenameFile } from "../../services/ipfs/ipfs.service.js"
import { getFileNameAndExtension } from "../../utils/common.js";
import * as snarkjs from "snarkjs";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

//private function
const getUniqueFilenameHandler = async (currDir) => {
  let cmdTxt = 'select name from files where directory_id=$1'
  let param = [currDir]

  let filenameList = []

  try {
    let queryResult = await getQuery(cmdTxt, param);
    if (queryResult.length > 0)
      filenameList = queryResult.map(res => res.name)
  } catch { }

  const getUniqueFilename = (name) => {
    let filename = name || 'Untitled File';
    let exist = true;
    let counter = 1;
    const filenameObject = getFileNameAndExtension(filename);

    while (exist) {
      if (filenameList.includes(filename)) {
        filename = `${filenameObject.name} (${counter}).${filenameObject.extension}`
        counter++
      } else {
        exist = false
      }
    }

    return filename
  }

  return getUniqueFilename;
}

const getPrevCid = async (user_id) => {
  let cmdTxt = `
      SELECT directory_ipfs_cid 
      FROM users
      WHERE id=$1
    `;
  let param = [user_id];
  const prevCid = (await getQuery(cmdTxt, param))[0];
  return !!prevCid ? '' : prevCid['directory_ipfs_cid'];
}


// router function
export const getPathId = async (req, res, next) => {
  const user_id = req.session.user_id;
  const path = req.body.path

  let cmdTxt = `SELECT id, parent_directory_id FROM directory WHERE id=$1 and user_id=$2`
  let param = [path, user_id]
  let valid = false
  let pathId = path;
  let parent_directory_id = null

  try {
    const pathId = await getQuery(cmdTxt, param)
    if (pathId.length > 0) {
      valid = true
    }
  } catch { }

  if (!valid) {
    cmdTxt = `select id from directory 
              where user_id=$1
              and parent_directory_id is null`
    param = [user_id]

    const pathIdResult = await getQuery(cmdTxt, param)
    pathId = pathIdResult[0].id
  }

  cmdTxt = `select parent_directory_id from directory
            where user_id=$1 and id=$2`

  let tempId = pathId
  let parentDir = ''
  while (true) {
    param = [user_id, tempId]
    let parent = await getQuery(cmdTxt, param)

    if (parent.length === 0 || !parent[0].parent_directory_id)
      break

    tempId = parent[0].parent_directory_id
    parentDir = `${tempId}/` + parentDir
  }

  const result = {
    currDir: pathId,
    parentDir: parentDir
  }

  return res.status(200).send(successMessage('Data fetch successfully', result))
}

export const getItem = async (req, res, next) => {
  const user_id = req.session.user_id;
  const page = req.body.page ?? 1;
  const limit = req.body.limit ?? 10;
  const parentDir = req.body.parentDir ?? null;

  try {
    let cmdTxt = `
      SELECT id, name, user_id, '' "category", updated_at, 'dir' "type", null "size"
      FROM directory
      WHERE user_id = $1
      AND parent_directory_id = $2
      -- AND parent_directory_id  IS NOT DISTINCT FROM (SELECT parent_directory_id FROM directory WHERE id=$2)
      union
      select id, name, user_id, category, updated_at, 'file' "type", size
      from files
      WHERE user_id = $1
      and directory_id = $2
      order by type, name
      LIMIT $3
      offset($4)*10;
      `
    let param = [user_id, parentDir, limit, page - 1]

    let response = await getQuery(cmdTxt, param)

    return res.status(200).send(successMessage('Fetched', response))
  } catch (err) {
    console.error(err)
    res.status(500).send(errorMessage(`Fail to fetch file`));
  }
}

export const addDirectory = async (req, res, next) => {
  const user_id = req.session.user_id
  const dirName = req.body.dirName
  const parentDir = req.body.parentDir

  try {
    const validationQuery = `
      SELECT 1 FROM directory
      WHERE user_id = $1 
      AND name = $2 
      AND (parent_directory_id = $3 OR ($3 IS NULL AND parent_directory_id IS NULL))
      LIMIT 1
    `

    const validate = await getQuery(validationQuery, [user_id, dirName, parentDir]);

    if (validate.length > 0) {
      res.status(500).send(errorMessage(`${dirName} has already existed`));
      return
    }

    const insertQuery = `
      INSERT INTO directory(user_id, name, parent_directory_id)
      VALUES ($1, $2, $3)
    `

    await executeQuery(insertQuery, [user_id, dirName, parentDir])

    res.status(200).send(successMessage(`${dirName} has been added successfully`))
  } catch (err) {
    console.error(err)
    res.status(500).send(errorMessage(`Something went wrong when adding ${dirName}`));
  }
};

export const uploadFile = async (req, res, next) => {
  // const user_id = '84868f40-85fa-41ec-93e6-9e3e4b02e629'
  const user_id = req.session.user_id
  const address = req.session.siwe ? (req.session.siwe.address ? req.session.siwe.address : 'Others') : 'Others'
  const path = req.body.path
  const currDir = path.split('/').pop()
  const category = req.body.category
  const files = req.files

  try {
    if (!files) {
      return res.status(400).send(clientErrorMessage('No Files Uploaded'))
    }

    //handle filename
    let cmdTxt = 'select name from files where directory_id=$1'
    let param = [currDir]

    let filenameList = []

    try {
      let queryResult = await getQuery(cmdTxt, param);
      if (queryResult.length > 0)
        filenameList = queryResult.map(res => res.name)
    } catch { }

    const getUniqueFilename = await getUniqueFilenameHandler(currDir)

    // get cid
    cmdTxt = `
      SELECT directory_ipfs_cid 
      FROM users
      WHERE id=$1
    `
    param = [user_id]

    const prevCid = await getPrevCid(user_id)

    const cid = await ipfsAddFile(address, path, files, prevCid, getUniqueFilename)

    cmdTxt = 'UPDATE users SET directory_ipfs_cid=$1 WHERE id=$2'
    param = [cid.dirCid, user_id]
    await executeQuery(cmdTxt, param)

    // insert file
    cmdTxt = `
      INSERT INTO files(user_id, directory_id, name, category, ipfs_cid, file_hash, size)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `

    for (const file of cid.filesCid) {
      const param = [user_id, currDir, file.filename, category, file.cid, file.hash, file.size];
      await executeQuery(cmdTxt, param);
    }

    return res.status(200).send(successMessage(`File has been added successfully`, cid))
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json(errorMessage("Internal Server Error: Fail to Upload File"));
  }
}

export const downloadFile = async (req, res) => {
  // const user_id = 'fe8cb6dc-72a2-4981-96eb-70060c7929dd'
  try {
    const user_id = req.session.user_id
    const id = req.body.id
    let cmdTxt = `
      select ipfs_cid, name
      from files
      where user_id=$1
      and id=$2
    `
    let param = [user_id, id]

    const result = await getQuery(cmdTxt, param)

    if (!result[0]) {
      return res.status(400).send(clientErrorMessage("Files can't be found"))
    }

    const cid = result[0]['ipfs_cid']
    const fileName = result[0]['name']

    const file = await ipfsGetFile(cid)

    res.header('Access-Control-Expose-Headers', 'Content-Disposition');
    res.set({
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Type': 'application/octet-stream',
    });

    return res.send(file)

  } catch {
    return res.status(500).json(errorMessage("Internal Server Error: Fail to Retrieve File"));
  }
}

export const renameFile = async (req, res) => {
  try {
    // const user_id = 'fe8cb6dc-72a2-4981-96eb-70060c7929dd'
    // const address = '0x6bBCff274010f00eFF7B839aa023D8b445A7ac7E'
    const user_id = req.session.user_id;
    const address = req.session.siwe ? (req.session.siwe.address ? req.session.siwe.address : 'Others') : 'Others'
    const path = req.body.path;
    const currDir = path.split('/').pop();
    const prevName = req.body.prevName;
    const newName = req.body.newName;
    const type = req.body.type;
    const id = req.body.id


    if (type === 'files') {
      const getUniqueFilename = await getUniqueFilenameHandler(currDir);
      const prevCid = await getPrevCid(user_id);
      const { dirCid } = await ipfsRenameFile(address, path, prevName, newName, prevCid, getUniqueFilename)

      let cmdTxt = `update users set directory_ipfs_cid=$1 where id=$2`
      let param = [dirCid, user_id]
      await executeQuery(cmdTxt, param)
    }

    let cmdTxt = `
      update ${type}
      set name=$1
      where user_id=$2
      and id=$3
    `
    let param = [newName, user_id, id]

    await executeQuery(cmdTxt, param)

    return res.send(successMessage("File renamed successfully"))

  } catch (e) {
    console.log(e)
    return res.status(500).json(errorMessage("Internal Server Error: Fail to Rename"));
  }
}

export const deleteFileHandler = async (req, res) => {
  try {
    const user_id = req.session.user_id
    const address = req.session.siwe.address
    // const user_id = 'fe8cb6dc-72a2-4981-96eb-70060c7929dd'
    // const address = '0x6bBCff274010f00eFF7B839aa023D8b445A7ac7E'
    const path = req.body.path;
    const currDir = path.split('/').pop();
    const type = req.body.type;
    const id = req.body.id
    let filename;

    const prevCid = await getPrevCid(user_id)
    if (!!prevCid) {
      return res.status(500).send(clientErrorMessage("Something is wrong, please contact admin!"))
    }

    if (type === 'files') {
      let cmdTxt = `
          select name from files where user_id=$1 and id=$2;
        `
      let param = [user_id, id]
      filename = (await getQuery(cmdTxt, param))[0]['name']
    }

    let cmdTxt = `
      delete from ${type}
      where user_id=$1
      and id=$2;
    `
    let param = [user_id, id]
    await executeQuery(cmdTxt, param)

    if (type === 'files') {
      const newDirectoryCid = await ipfsDeleteFile(address, path, filename, prevCid)
      cmdTxt = `
        update users
        set directory_ipfs_cid=$1
        where id=$2;
      `
      param = [newDirectoryCid.dirCid, user_id]
      await executeQuery(cmdTxt, param)
    }

    return res.send(successMessage("File deleted successfully"))
  } catch (e) {
    console.log(e)
    return res.status(500).json(errorMessage("Internal Server Error: Fail to Delete"));
  }
}

export const getStats = async (req, res) => {
  const user_id = req.session.user_id;

  let cmdTxt = `select count(*) as total from files where user_id=$1`
  let param = [user_id]
  const totalFile = (await getQuery(cmdTxt, param))[0].total

  cmdTxt = `select count(*) as total from directory where user_id=$1`
  const totalDir = (await getQuery(cmdTxt, param))[0].total

  cmdTxt = `select name, size, created_at from files 
            where user_id=$1
            order by created_at desc
            limit 1`

  let fileStat = await getQuery(cmdTxt, param)
  let latestFileName = '-'
  let latestFileSize = '-'
  let latestFileUploadDate = '-'
  if (fileStat.length > 0) {
    fileStat = fileStat[0]
    latestFileName = fileStat.name
    latestFileSize = fileStat.size
    latestFileUploadDate = fileStat.created_at
  }


  return res.status(200).send({
    totalFile: totalFile,
    totalDir: totalDir,
    latestFileName: latestFileName,
    latestFileSize: latestFileSize,
    latestFileUploadDate: latestFileUploadDate
  })
}

export const getMostCategoryList = async (req, res) => {
  const user_id = req.session.user_id;
  let cmdTxt = `SELECT name, category, size, created_at FROM files
                WHERE user_id = $1
                AND category = (
                  SELECT category
                  FROM files
                  WHERE user_id = $1
                  GROUP BY category
                  ORDER BY COUNT(*) DESC
                  LIMIT 1
                );`

  let param = [user_id]

  const categoryList = await getQuery(cmdTxt, param)
  return res.status(200).send(categoryList)
}

// async function verifyProof() {
//   const vKey = JSON.parse(fs.readFileSync("verification_key.json"));

//   const proof = JSON.parse(fs.readFileSync("proof.json"));
//   const publicSignals = JSON.parse(fs.readFileSync("public.json"));

//   const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

//   console.log("Verification result:", res); // true or false
// }

export const verifyProof = async (req, res) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const verificationKeyPath = path.join(__dirname, '../../zksnark/circuit/verification_key.json');
    const publicSignals = req.body.publicSignals;
    const proof = req.body.proof;

    // Check if required data is present
    if (!publicSignals || !proof) {
      return res.status(400).json({
        success: false,
        message: 'Missing proof or public signals'
      });
    }

    const verificationKey = JSON.parse(fs.readFileSync(verificationKeyPath, 'utf-8'));
    // Get the actual verification result
    const verificationResult = await snarkjs.groth16.verify(verificationKey, publicSignals, proof);

    if (!verificationResult) {
      return res.status(400).result(errorMessage("File verification failed!"))
    }

    const hashBytes = [];
    const bitArray = publicSignals;

    // Convert bits back to bytes (8 bits per byte)
    for (let i = 0; i < bitArray.length; i += 8) {
      let byte = 0;
      for (let j = 0; j < 8; j++) {
        byte = (byte << 1) | (bitArray[i + j] & 1);
      }
      hashBytes.push(byte);
    }

    // Convert bytes to a hex string (SHA-256-like format)
    const hexHash = hashBytes.map(b =>
      b.toString(16).padStart(2, '0')  // Ensure 2-digit hex
    ).join('');

    console.log(hexHash)

    const user_id = req.session.user_id
    let cmdTxt = `select f.name "filename", category, coalesce(nullif(d.name, ''), 'root') "dirname", d.id "path"
                  from files f
                  join directory d on f.directory_id  = d.id
                  where f.user_id=$1
                  and file_hash=$2`
    let param = [user_id, hexHash]

    let response = await getQuery(cmdTxt, param)
  
    // IMPORTANT: Return a proper JSON response with success/error status
    return res.status(200).send(response);
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({
      success: false,
      message: 'Error during verification',
      error: error.message
    });
  }
}