"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserController_1 = require("../controller/UserController");
const express_1 = __importDefault(require("express"));
const FileUploader_1 = require("../middleware/FileUploader");
const app = express_1.default.Router();
app.post("/sendotp", UserController_1.SendOtpViaSms);
app.post("/verityotp", UserController_1.verifyOtp);
app.post("/convert-to-zip", FileUploader_1.uploadPhotos.array("files", 10), UserController_1.convertToZip);
app.post("/upload", FileUploader_1.uploadPhotos.single("single"), UserController_1.uploadfile);
app.get("/files", UserController_1.FileManagement);
app.get("/extract-text", FileUploader_1.uploadPhotos.single("single"), UserController_1.imageToText);
app.get("/parallel", UserController_1.runFilesParallel);
app.get("/series", UserController_1.runAsyncSeries);
app.post("/waterfall", UserController_1.runAsyncWaterfall);
app.post("/queue", UserController_1.runAsyncQueue);
app.get("/text-to-speech", UserController_1.textToSpeechConv);
app.get('/rimrif', UserController_1.RimRif);
exports.default = app;
