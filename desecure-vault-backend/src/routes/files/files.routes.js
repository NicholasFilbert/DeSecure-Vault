import express from "express";
import { addDirectory, deleteFileHandler, downloadFile, getItem, getPathId, renameFile, getStats, uploadFile, getMostCategoryList, verifyProof } from "../../controllers/files/files.controller.js";
import upload from "../../utils/multer.js"

const router = express.Router();

router.post('/get-path-id', getPathId)
router.post('/get-item', getItem);
router.post('/add-directory', addDirectory);
router.post('/upload-file', upload.array('files', 10), uploadFile)

router.post('/download', downloadFile)
router.post('/rename', renameFile)
router.post('/delete', deleteFileHandler)

router.post('/stats', getStats)
router.post('/most-category-list', getMostCategoryList)

router.post('/verify-proof', verifyProof)

export default router;