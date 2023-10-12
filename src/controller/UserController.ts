import User from "../models/UserSchema";
import { Request, Response } from "express";
import Twilio from "twilio";
import archiver from "archiver";
import fs from "fs";
import https from "https"
import path from "path";
import util from "util"
import { rimraf } from "rimraf"
import Tesseract from "tesseract.js";
import async, { AsyncResultCallback } from "async";
import { images } from "../middleware/Images";
import textToSpeech from "@google-cloud/text-to-speech"


const client = Twilio(process.env.ACCOUNT_SID, process.env.ACCOUNT_TOKEN);

var otp: string;
const sendTextMessage = async (mobile: string, otp: string) => {
  try {
    const msg = await client.messages.create({
      body: `Your Otp is ${otp} , valid for next 10-min.`,
      to: `+91${mobile}`,
      from: "+16562188441", // From a valid Twilio numberw
    });
    return msg;
  } catch (error) {
    return error;
  }
};

export const SendOtpViaSms = async (req: Request, res: Response) => {
  const mobile = req.body?.mobile;
  otp = Math.round(Math.random() * 1000000).toString();
  const user = await User.findOneAndUpdate(
    { mobile },
    { mobile: mobile, otp },
    { upsert: true, new: true }
  );

  try {
    // const msg = sendTextMessage(mobile, otp)
    res.status(200).json({
      user,
      success: true,
      message: `Verification code sent to ${mobile} `,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `Incorrect Number or Invalid Number.` });
  }
};
export const verifyOtp = async (req: Request, res: Response) => {
  const curOTP = req.body?.otp;

  const enterOtp = curOTP.toString().replaceAll(",", "");
  if (otp == enterOtp) {
    res
      .status(200)
      .json({ success: true, message: "user logged in sucessfully." });
  } else {
    res.status(403).json({ success: true, message: "otp incorrect." });
  }
};
export const createserviceId = async (): Promise<string> => {
  try {
    const service = await client.verify.v2.services.create({
      friendlyName: "My First Verify Service",
    });
    console.log("Verify Service SID:", service.sid);
    return service.sid as string;
  } catch (error) {
    console.error("Error creating Verify Service:", error);
    throw new Error("Failed to create Verify Service");
  }
};
// export const sendOtp = async (req: Request, res: Response) => {
//     try {
//         const { to } = req.body;

//         // const serviceSid = await createserviceId()
//         serviceSid = "VAd88877f4a92443af31fe5d0c53eda20c"

//         const verification = await client.verify.v2.services(serviceSid).verifications.create({ to, channel: "sms" })
//         console.log(verification.status);

//         res.json({ success: true, message: `Sent verification code to ${to} ` });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Error sending OTP.' });
//     }
// }

// export const verifyOtp = async (req: Request, res: Response) => {
//     try {
//         const { to, code } = req.body;

//         const verificationCheck = await client.verify.v2.services(serviceSid).verificationChecks.create({
//             to,
//             code,
//         });

//         if (verificationCheck.status === 'approved') {
//             res.json({ success: true, message: 'OTP verified successfully.' });
//         } else {
//             res.status(400).json({ success: false, message: 'Incorrect OTP.' });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Error verifying OTP.' });
//     }
// }

export const FileManagement = (req: Request, res: Response) => {
  console.log(__dirname);

  res.send("backend file system");
};

export const uploadfile = (req: Request, res: Response) => {
  const date = new Date().toLocaleTimeString("en-IN", {
    hour: "numeric",
    hour12: true,
    minute: "numeric"
  });

  console.log(date)
  // const CorrectfilePath = path.join(
  //   __dirname,
  //   "../../",
  //   req.file?.path as string
  // );
  res.json({ date });
};

export const convertToZip = (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const filepath = path.join(__dirname, "../../uploads");

  const output = fs.createWriteStream(filepath + "/example.zip");
  const archive = archiver("zip", {
    zlib: { level: 9 }, // Sets the compression level.
  });

  // pipe archive data to the file
  archive.pipe(output);
  // append a file from stream
  for (const file of files) {
    const { path } = file;
    archive.file(path, { name: file.filename });
  }
  // append the folders
  archive.directory("src/", "source");

  output.on("close", function () {
    console.log(archive.pointer() + " total bytes");
    console.log(
      "archiver has been finalized and the output file descriptor has closed."
    );
  });

  output.on("end", function () {
    console.log("Data has been drained");
  });
  archive.finalize();
};

export const imageToText = async (req: Request, res: Response) => {
  const filepath = path.join(__dirname, "../../" + req.file?.path);
  const data = await Tesseract.recognize(filepath, "eng", {
    logger: (e) => console.log(e),
  });
  console.log(data.data.text);
};

function fetchUserData(userId: number): Promise<{ id: number; name?: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Fetching user data for user ${userId}`);
      // Simulated user data
      const userData = { id: userId, name: `User ${userId}` };
      resolve(userData);
    }, Math.random() * 1000); // Simulated delay
  });
}

function fetchProductData(
  productId: number
): Promise<{ id: number; name: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Fetching product data for product ${productId}`);
      // Simulated product data
      const productData = { id: productId, name: `Product ${productId}` };
      resolve(productData);
    }, Math.random() * 1000); // Simulated delay
  });
}
// it will execute all functions at the same time. but at any func if it encounters error. it will stop executing.
export const runFilesParallel = async (req: Request, res: Response) => {
  const stack = [];
  const fun1 = function (cb: AsyncResultCallback<any>) {
    cb(null, "first function");
  };
  const fun2 = function (cb: AsyncResultCallback<any>) {
    cb(null, "second function");
  };
  const fun3 = function (cb: AsyncResultCallback<any>) {
    cb(null, "third function");
  };
  stack.push(fun1);
  stack.push(fun2);
  stack.push(fun3);

  async.parallel(stack, function (err: any, result) {
    if (err) {
      throw new Error(err);
    }
    res.json(result);
  });
};

export const runAsyncSeries = async (req: Request, res: Response) => {
  async.series(
    [
      function fun1(cb) {
        cb(null, "from function 1");
      },
      function fun2(cb) {
        cb(null, "from function 2");
      },
      function fun3(cb) {
        cb(null, "from function 3");
      },
    ],
    function (err: any, result) {
      if (err) {
        throw new Error(err);
      }
      console.log(result);
      res.json(result);
    }
  );
};

// waterfall will take the multiple func in array, the 1st func retured value is input for 2nd function.
export const runAsyncWaterfall = async (req: Request, res: Response) => {
  async.waterfall(
    [
      function waitsometime(cb: AsyncResultCallback<any>) {
        setTimeout(() => {
          console.log(`waited some time ${3000}`);
          cb(null, 30000);
        }, 3000);
      },
      function secondFunc(time: number, cb: AsyncResultCallback<any>) {
        console.log(time, "from sencondFunc");
        cb(null, time);
      },
    ],
    function (err, result) {
      if (err) {
        console.error(err, "err from result");
        return;
      }
      console.log(result, "from result.");
    }
  );
};

interface Task {
  name?: string;
  Url?: string;
}
var count = 0
function dowloadFileFromUrl(Url: string, dir: string, callback: AsyncResultCallback<any>) {
  var ext = path.extname(Url)
  const extension = Url.includes('?')
  if (extension) {
    const index = ext.indexOf('?')
    ext = ext.slice(0, index)
  }

  if (ext) {
    const file = fs.createWriteStream(`${dir}/file${++count}.${ext}`)
    const request = https.get(Url, (responce) => {
      responce.pipe(file)
      callback()
    })
  } else {
    console.log("cannot download this image from this url: ", Url);
    callback()

  }


}

export const runAsyncQueue = async (req: Request, res: Response) => {
  var q = async.queue(function (task: Task, callback: AsyncResultCallback<any>) {

    setTimeout(() => {
      dowloadFileFromUrl(task.Url as string, 'C:/Users/Ahex Tech/Desktop/Images', () => { callback() })
      console.log(`Downloading... file${count}`)
    }, 1000);

  }, 1);


  images.forEach((Url: string) => {
    q.push({ Url })
  })
  q.drain(function () {
    console.log("All items have been processed");
    res.json({ msg: 'All items have been processed from the queue. ', que: q.length() })
  })
  q.error(function (err, task) {
    console.log(err);
    console.log(`task experienced an error`);
  })
};

export const textToSpeechConv = async (req: Request, res: Response) => {
  const client = new textToSpeech.TextToSpeechClient();
  const text = 'hello, world!';
  const request: any = {
    input: { text: text },
    // Select the language and SSML voice gender (optional)
    voice: { languageCode: 'en-US', ssmlGender: "" },
    // Select the type of audio encoding
    audioConfig: { audioEncoding: 'MP3' },
  };
  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);
  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile);
  await writeFile('output.mp3', response.audioContent as string, 'binary');
  console.log('Audio content written to file: output.mp3');
}


export const RimRif = async (req: Request, res: Response) => {

  const dir = path.join(__dirname + "../../../uploads/")
  console.log(dir);
  fs.readdir(dir, function (err, files) {
    if (err) {
      console.log(err);
      return
    }
    files.forEach(function (file, index) {
      fs.stat(path.join(dir, file), function (err, stat) {
        var endTime, now;
        if (err) {
          return console.log(err)
        }
        now = new Date().getTime();
        endTime = new Date(stat.ctime).getTime() * 15000;

        if (now > endTime) {
          const rmv = rimraf(path.join(dir, file))
          console.log('removed the file');
          return rmv
        }
      })

    })
  })

}
