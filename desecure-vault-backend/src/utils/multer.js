import multer from 'multer'

// Define Multer storage configuration
const storage = multer.memoryStorage();  // Store files in memory (buffer)

// Optional: Define any limits (e.g., file size)
// const limits = {
//   fileSize: 10 * 1024 * 1024,  // 10MB max file size
// };

// Optional: Define file filters (e.g., only allow images)
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);  // Accept the file
//   } else {
//     cb(new Error('Only image files are allowed'), false);  // Reject the file
//   }
// };

// Create and return a Multer instance with the above configurations
const upload = multer({
  storage,
  // limits,
  // fileFilter,
});

export default upload;
