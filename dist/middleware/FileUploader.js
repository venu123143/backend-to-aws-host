"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPhotos = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const multerStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        if (!fs_1.default.existsSync('uploads')) {
            fs_1.default.mkdirSync('uploads');
        }
        cb(null, 'uploads');
    },
    filename: function (req, file, callback) {
        const uniqueSufix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        let ext = path_1.default.extname(file === null || file === void 0 ? void 0 : file.originalname);
        const fileName = (file === null || file === void 0 ? void 0 : file.originalname.split(' ')[0]) + '-' + uniqueSufix + ext;
        console.log(fileName);
        callback(null, fileName);
    },
});
const multerFilter = (req, file, cb) => {
    if (file === null || file === void 0 ? void 0 : file.mimetype.startsWith('image')) {
        cb(null, true);
    }
    else {
        cb(new Error('Unsupported formatted file'));
    }
};
exports.uploadPhotos = (0, multer_1.default)({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fieldSize: 8 * 1000 * 1000 }
});
