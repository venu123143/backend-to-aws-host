

 // Use AUTH_TOKEN instead of ACCOUNT_TOKEN


 
    // client.verify.v2
    //     .services(verifySid)
    //     .verifications.create({ to: "+918008952100", channel: "sms" })
    //     .then((verification) => console.log(verification.status))
    //     .then(() => {
    //         const readline = require("readline").createInterface({
    //             input: process.stdin,
    //             output: process.stdout,
    //         });
    //         readline.question("Please enter the OTP:", (otpCode: string) => {
    //             client.verify.v2
    //                 .services(verifySid)
    //                 .verificationChecks.create({ to: "+918008952100", code: otpCode })
    //                 .then((verification_check) => console.log(verification_check.status))
    //                 .then(() => readline.close());
    //         });
    //     });
