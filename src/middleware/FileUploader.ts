import multer, { FileFilterCallback } from "multer"
import { Request, Response, NextFunction } from 'express';
import path from "path";
import fs from "fs"

const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads')
        }
        cb(null, 'uploads')
    },
    filename: function (req, file, callback) {
        const uniqueSufix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        let ext = path.extname(file?.originalname)
        const fileName = file?.originalname.split(' ')[0] + '-' + uniqueSufix + ext
        console.log(fileName);
        callback(null, fileName)

    },
})
const multerFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    
    if (file?.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new Error('Unsupported formatted file'))
    }
}


export const uploadPhotos = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fieldSize: 8 * 1000 * 1000 }
})