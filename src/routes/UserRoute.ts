/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         mobile:
 *           type: string
 *         about:
 *           type: string
 *         profile:
 *           type: string
 *         otp:
 *           type: string
 *       required:
 *         - mobile
 *         - about
 */

import {
  FileManagement,
  SendOtpViaSms,
  verifyOtp,
  uploadfile,
  convertToZip,
  imageToText,
  runAsyncSeries,
  runAsyncWaterfall,
  runFilesParallel,
  runAsyncQueue,
  textToSpeechConv,RimRif
} from "../controller/UserController";
import express from "express";
import { uploadPhotos } from "../middleware/FileUploader";
const app = express.Router();

/**
 * @swagger
 * /users/sendotp:
 *   post:
 *     summary: Send OTP via SMS.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *             required:
 *               - phoneNumber
 *     responses:
 *       200:
 *         description: OTP sent successfully.
 *       400:
 *         description: Invalid request.
 */
app.post("/sendotp", SendOtpViaSms);
// app.post('/sendotp', sendOtp)
/**
 * @swagger
 * /users/verityotp:
 *   post:
 *     summary: Verify OTP.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *             required:
 *               - otp
 *     responses:
 *       200:
 *         description: OTP verification successful.
 *       400:
 *         description: Invalid OTP.
 */
app.post("/verityotp", verifyOtp);
/**
 * @swagger
 * /users/convert-tp-zip:
 *   post:
 *     summary: Convert uploaded photos to a ZIP file.
 *     tags: [File Management]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - files
 *     responses:
 *       200:
 *         description: Photos converted and zipped successfully.
 *       400:
 *         description: Invalid request or file upload error.
 */
app.post("/convert-to-zip", uploadPhotos.array("files", 10), convertToZip);
/**
 * @swagger
 * /users/upload:
 *   post:
 *     summary: Upload a single file.
 *     tags: [File Management]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               single:
 *                 type: string
 *             required:
 *               - single
 *     responses:
 *       200:
 *         description: File uploaded successfully.
 *       400:
 *         description: Invalid request or file upload error.
 */
app.post("/upload", uploadPhotos.single("single"), uploadfile);
/**
 * @swagger
 * /users/files:
 *   get:
 *     summary: Get a list of files.
 *     tags: [File Management]
 *     responses:
 *       200:
 *         description: List of files retrieved successfully.
 */
app.get("/files", FileManagement);
app.get("/extract-text", uploadPhotos.single("single"), imageToText);

/**
 * @swagger
 * /users/parallel:
 *   get:
 *     summary: Execute tasks in parallel.
 *     tags: [Async Operations]
 *     responses:
 *       200:
 *         description: Parallel tasks executed successfully.
 */
app.get("/parallel", runFilesParallel);
/**
 * @swagger
 * /users/series:
 *   get:
 *     summary: Execute tasks in series.
 *     tags: [Async Operations]
 *     responses:
 *       200:
 *         description: Series tasks executed successfully.
 */
app.get("/series", runAsyncSeries);
/**
 * @swagger
 * /users/waterfall:
 *   post:
 *     summary: Execute tasks in a waterfall pattern.
 *     tags: [Async Operations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               time:
 *                 type: number
 *             required:
 *               - time
 *     responses:
 *       200:
 *         description: Waterfall tasks executed successfully.
 */
app.post("/waterfall", runAsyncWaterfall);
/**
 * @swagger
 * /users/queue:
 *   post:
 *     summary: Execute tasks in a waterfall pattern.
 *     tags: [Async Operations]
 */
app.post("/queue", runAsyncQueue)
app.get("/text-to-speech", textToSpeechConv)

app.get('/rimrif', RimRif)
// app.put('/update/:id',)
export default app;
