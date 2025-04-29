import { executeQuery, getQuery } from "../../utils/db.js";
import { clientErrorMessage, errorMessage, successMessage } from "../../utils/message.js";
import { ipfsAddFile, ipfsDeleteFile, ipfsGetFile, ipfsRenameFile } from "../../services/ipfs/ipfs.service.js"
import { getFileNameAndExtension } from "../../utils/common.js";

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
    if (pathId > 0) {
      parent_directory_id = pathId[0].parent_directory_id
      valid = true
    }
  } catch { }

  if (!valid) {
    cmdTxt = `select id, parent_directory_id from directory 
              where user_id=$1
              and parent_directory_id is null`
    param = [user_id]

    const pathIdResult = await getQuery(cmdTxt, param)
    pathId = pathIdResult[0].id
    parent_directory_id = pathIdResult[0].parent_directory_id
  }

  const result = {
    currDir: pathId,
    parentDir: parent_directory_id
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
      SELECT id, name, user_id, updated_at, 'dir' "type", null "size"
      FROM directory
      WHERE user_id = $1
      AND parent_directory_id = $2
      -- AND parent_directory_id  IS NOT DISTINCT FROM (SELECT parent_directory_id FROM directory WHERE id=$2)
      union
      select id, name, user_id, updated_at, 'file' "type", size
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

    const getUniqueFilename = (file) => {
      let filename = file.originalname || 'Untitled File';
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


    // get cid
    cmdTxt = `
      SELECT directory_ipfs_cid 
      FROM users
      WHERE id=$1
    `
    param = [user_id]

    const prevCid = (await getQuery(cmdTxt, param))[0]

    const cid = await ipfsAddFile(address, path, files, !!prevCid ? '' : prevCid['directory_ipfs_cid'], getUniqueFilename)

    cmdTxt = 'UPDATE users SET directory_ipfs_cid=$1 WHERE id=$2'
    param = [cid.dirCid, user_id]
    await executeQuery(cmdTxt, param)

    // insert file

    cmdTxt = `
      INSERT INTO files(user_id, directory_id, name, category, ipfs_cid, size)
      VALUES ($1, $2, $3, $4, $5, $6)
    `

    cid.filesCid.forEach(async file => {
      param = [user_id, currDir, file.filename, category, file.cid, file.size]
      await executeQuery(cmdTxt, param)
    });

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
      const {dirCid} = await ipfsRenameFile(address, path, prevName, newName, prevCid, getUniqueFilename)

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
    // const user_id = req.session.user_id
    // const address = req.session.siwe.address
    const user_id = 'fe8cb6dc-72a2-4981-96eb-70060c7929dd'
    const address = '0x6bBCff274010f00eFF7B839aa023D8b445A7ac7E'
    const type = req.body.type;
    const id = req.body.id

    // Get directory ipfs cid
    let cmdTxt = `select directory_ipfs_cid from users where id=$1`
    let param = [user_id]
    let queryResult = await getQuery(cmdTxt, param)
    if (!queryResult[0]) {
      return res.status(500).send(clientErrorMessage("Something is wrong, please contact admin!"))
    }
    const directory_cid = queryResult[0]['directory_ipfs_cid']

    // get filename
    cmdTxt = `select name from ${type} where user_id=$1 and id=$2`
    param = [user_id, id]

    queryResult = await getQuery(cmdTxt, param)
    if (!queryResult[0]) {
      return res.status(500).send(clientErrorMessage("Something is wrong, please contact admin!"))
    }
    const filename = queryResult[0]['name']
    console.log(directory_cid, filename)

    const newDirectoryCid = await ipfsDeleteFile(address, filename, directory_cid)


    cmdTxt = `
      delete from ${type}
      where user_id=$1
      and id=$2;
    `
    param = [user_id, id]
    await executeQuery(cmdTxt, param)

    cmdTxt = `
      update users
      set directory_ipfs_cid=$1
      where id=$2;
    `
    param = [newDirectoryCid.dirCid, user_id]
    await executeQuery(cmdTxt, param)

    return res.status(200).send(newDirectoryCid.dirCid)


  } catch (e) {
    console.log(e)
    return res.status(500).json(errorMessage("Internal Server Error: Fail to Delete"));
  }
}

export const shareFile = async (req, res) => {

}
