import { Request, Response } from "express"
import { getGoogleOauthTokens, getGoogleUser } from "../utils/googleLoginfns"
import jwt from "jsonwebtoken"
const googleOauthHandler = async (req: Request, res: Response) => {
    // GET THE CODE FROM QS
    const code = req.query.code as string

    try {
        // GET THE ID AND ACCESSTOKE WITH THE CODE
        const { id_token, access_token } = await getGoogleOauthTokens({ code })
        const googleUser = await getGoogleUser({ id_token, access_token })
        // jwt.decode(id_token)

        // GET THE USER WITH TOKENS
        // UPSERT THE USER AND CREATE SESSION
        // CREATE ACCESS AND REFRESH TOKENS
        // SETUP COOKIES AND REDIRECT BACK TO CLIENT
    } catch (error) {
        return res.redirect(process.env.CLIENT_ORIGIN as string)

    }


}

export default googleOauthHandler