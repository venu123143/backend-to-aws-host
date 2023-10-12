"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RimRif = exports.textToSpeechConv = exports.runAsyncQueue = exports.runAsyncWaterfall = exports.runAsyncSeries = exports.runFilesParallel = exports.imageToText = exports.convertToZip = exports.uploadfile = exports.FileManagement = exports.createserviceId = exports.verifyOtp = exports.SendOtpViaSms = void 0;
const UserSchema_1 = __importDefault(require("../models/UserSchema"));
const twilio_1 = __importDefault(require("twilio"));
const archiver_1 = __importDefault(require("archiver"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("util"));
const rimraf_1 = require("rimraf");
const tesseract_js_1 = __importDefault(require("tesseract.js"));
const async_1 = __importDefault(require("async"));
const Images_1 = require("../middleware/Images");
const text_to_speech_1 = __importDefault(require("@google-cloud/text-to-speech"));
const client = (0, twilio_1.default)(process.env.ACCOUNT_SID, process.env.ACCOUNT_TOKEN);
var otp;
const sendTextMessage = (mobile, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const msg = yield client.messages.create({
            body: `Your Otp is ${otp} , valid for next 10-min.`,
            to: `+91${mobile}`,
            from: "+16562188441",
        });
        return msg;
    }
    catch (error) {
        return error;
    }
});
const SendOtpViaSms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const mobile = (_a = req.body) === null || _a === void 0 ? void 0 : _a.mobile;
    otp = Math.round(Math.random() * 1000000).toString();
    const user = yield UserSchema_1.default.findOneAndUpdate({ mobile }, { mobile: mobile, otp }, { upsert: true, new: true });
    try {
        res.status(200).json({
            user,
            success: true,
            message: `Verification code sent to ${mobile} `,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ success: false, message: `Incorrect Number or Invalid Number.` });
    }
});
exports.SendOtpViaSms = SendOtpViaSms;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const curOTP = (_b = req.body) === null || _b === void 0 ? void 0 : _b.otp;
    const enterOtp = curOTP.toString().replaceAll(",", "");
    if (otp == enterOtp) {
        res
            .status(200)
            .json({ success: true, message: "user logged in sucessfully." });
    }
    else {
        res.status(403).json({ success: true, message: "otp incorrect." });
    }
});
exports.verifyOtp = verifyOtp;
const createserviceId = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const service = yield client.verify.v2.services.create({
            friendlyName: "My First Verify Service",
        });
        console.log("Verify Service SID:", service.sid);
        return service.sid;
    }
    catch (error) {
        console.error("Error creating Verify Service:", error);
        throw new Error("Failed to create Verify Service");
    }
});
exports.createserviceId = createserviceId;
const FileManagement = (req, res) => {
    console.log(__dirname);
    res.send("backend file system");
};
exports.FileManagement = FileManagement;
const uploadfile = (req, res) => {
    const date = new Date().toLocaleTimeString("en-IN", {
        hour: "numeric",
        hour12: true,
        minute: "numeric"
    });
    console.log(date);
    res.json({ date });
};
exports.uploadfile = uploadfile;
const convertToZip = (req, res) => {
    const files = req.files;
    const filepath = path_1.default.join(__dirname, "../../uploads");
    const output = fs_1.default.createWriteStream(filepath + "/example.zip");
    const archive = (0, archiver_1.default)("zip", {
        zlib: { level: 9 },
    });
    archive.pipe(output);
    for (const file of files) {
        const { path } = file;
        archive.file(path, { name: file.filename });
    }
    archive.directory("src/", "source");
    output.on("close", function () {
        console.log(archive.pointer() + " total bytes");
        console.log("archiver has been finalized and the output file descriptor has closed.");
    });
    output.on("end", function () {
        console.log("Data has been drained");
    });
    archive.finalize();
};
exports.convertToZip = convertToZip;
const imageToText = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const filepath = path_1.default.join(__dirname, "../../" + ((_c = req.file) === null || _c === void 0 ? void 0 : _c.path));
    const data = yield tesseract_js_1.default.recognize(filepath, "eng", {
        logger: (e) => console.log(e),
    });
    console.log(data.data.text);
});
exports.imageToText = imageToText;
function fetchUserData(userId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Fetching user data for user ${userId}`);
            const userData = { id: userId, name: `User ${userId}` };
            resolve(userData);
        }, Math.random() * 1000);
    });
}
function fetchProductData(productId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Fetching product data for product ${productId}`);
            const productData = { id: productId, name: `Product ${productId}` };
            resolve(productData);
        }, Math.random() * 1000);
    });
}
const runFilesParallel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stack = [];
    const fun1 = function (cb) {
        cb(null, "first function");
    };
    const fun2 = function (cb) {
        cb(null, "second function");
    };
    const fun3 = function (cb) {
        cb(null, "third function");
    };
    stack.push(fun1);
    stack.push(fun2);
    stack.push(fun3);
    async_1.default.parallel(stack, function (err, result) {
        if (err) {
            throw new Error(err);
        }
        res.json(result);
    });
});
exports.runFilesParallel = runFilesParallel;
const runAsyncSeries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    async_1.default.series([
        function fun1(cb) {
            cb(null, "from function 1");
        },
        function fun2(cb) {
            cb(null, "from function 2");
        },
        function fun3(cb) {
            cb(null, "from function 3");
        },
    ], function (err, result) {
        if (err) {
            throw new Error(err);
        }
        console.log(result);
        res.json(result);
    });
});
exports.runAsyncSeries = runAsyncSeries;
const runAsyncWaterfall = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    async_1.default.waterfall([
        function waitsometime(cb) {
            setTimeout(() => {
                console.log(`waited some time ${3000}`);
                cb(null, 30000);
            }, 3000);
        },
        function secondFunc(time, cb) {
            console.log(time, "from sencondFunc");
            cb(null, time);
        },
    ], function (err, result) {
        if (err) {
            console.error(err, "err from result");
            return;
        }
        console.log(result, "from result.");
    });
});
exports.runAsyncWaterfall = runAsyncWaterfall;
var count = 0;
function dowloadFileFromUrl(Url, dir, callback) {
    var ext = path_1.default.extname(Url);
    const extension = Url.includes('?');
    if (extension) {
        const index = ext.indexOf('?');
        ext = ext.slice(0, index);
    }
    if (ext) {
        const file = fs_1.default.createWriteStream(`${dir}/file${++count}.${ext}`);
        const request = https_1.default.get(Url, (responce) => {
            responce.pipe(file);
            callback();
        });
    }
    else {
        console.log("cannot download this image from this url: ", Url);
        callback();
    }
}
const runAsyncQueue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var q = async_1.default.queue(function (task, callback) {
        setTimeout(() => {
            dowloadFileFromUrl(task.Url, 'C:/Users/Ahex Tech/Desktop/Images', () => { callback(); });
            console.log(`Downloading... file${count}`);
        }, 1000);
    }, 1);
    Images_1.images.forEach((Url) => {
        q.push({ Url });
    });
    q.drain(function () {
        console.log("All items have been processed");
        res.json({ msg: 'All items have been processed from the queue. ', que: q.length() });
    });
    q.error(function (err, task) {
        console.log(err);
        console.log(`task experienced an error`);
    });
});
exports.runAsyncQueue = runAsyncQueue;
const textToSpeechConv = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new text_to_speech_1.default.TextToSpeechClient();
    const text = 'hello, world!';
    const request = {
        input: { text: text },
        voice: { languageCode: 'en-US', ssmlGender: "" },
        audioConfig: { audioEncoding: 'MP3' },
    };
    const [response] = yield client.synthesizeSpeech(request);
    const writeFile = util_1.default.promisify(fs_1.default.writeFile);
    yield writeFile('output.mp3', response.audioContent, 'binary');
    console.log('Audio content written to file: output.mp3');
});
exports.textToSpeechConv = textToSpeechConv;
const RimRif = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dir = path_1.default.join(__dirname + "../../../uploads/");
    console.log(dir);
    fs_1.default.readdir(dir, function (err, files) {
        if (err) {
            console.log(err);
            return;
        }
        files.forEach(function (file, index) {
            fs_1.default.stat(path_1.default.join(dir, file), function (err, stat) {
                var endTime, now;
                if (err) {
                    return console.log(err);
                }
                now = new Date().getTime();
                endTime = new Date(stat.ctime).getTime() * 15000;
                if (now > endTime) {
                    const rmv = (0, rimraf_1.rimraf)(path_1.default.join(dir, file));
                    console.log('removed the file');
                    return rmv;
                }
            });
        });
    });
});
exports.RimRif = RimRif;
