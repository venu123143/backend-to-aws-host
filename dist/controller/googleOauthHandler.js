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
Object.defineProperty(exports, "__esModule", { value: true });
const googleLoginfns_1 = require("../utils/googleLoginfns");
const googleOauthHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.query.code;
    try {
        const { id_token, access_token } = yield (0, googleLoginfns_1.getGoogleOauthTokens)({ code });
        const googleUser = yield (0, googleLoginfns_1.getGoogleUser)({ id_token, access_token });
    }
    catch (error) {
        return res.redirect(process.env.CLIENT_ORIGIN);
    }
});
exports.default = googleOauthHandler;
