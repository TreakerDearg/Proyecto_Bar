import multer from "multer";

// Guardar archivos en memoria antes de subirlos a Cloudinary
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
