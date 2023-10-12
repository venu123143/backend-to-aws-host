import mongoose from 'mongoose'
import jwt from "jsonwebtoken"
export interface IUser extends Document {
    name: string;
    mobile: string;
    profile: string;
    otp: string;

}

var userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    about: {
        type: String,
        required: true,
    },
    profile: {
        type: String
    },
    otp: {
        type: String
    }
}, { collection: 'users', timestamps: true });


// we are generating token
userSchema.methods.generateAuthToken = async function () {
    try {
        let cur_token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY as jwt.Secret, { expiresIn: '1d' });
        this.refreshToken = cur_token
        await this.save();


        return cur_token;
    } catch (error) {
        console.log(error);
    }
}
//Export the model
export default mongoose.model<IUser>('User', userSchema);