
import multer from 'multer';
import { fileURLToPath } from 'url';
import {dirname} from 'path';
import path from 'path';
import {loggerErrorController} from './loggerControllers.js'


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//MULTER
const Storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, path.join(__dirname, '../public/uploads/'))
    },
    filename: (req,file,cb)=>{
        cb(null,`${req.body.email}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage:Storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        loggerErrorController('Solo se admiten archivos de tipo imagen.');
    }
})

export {upload}