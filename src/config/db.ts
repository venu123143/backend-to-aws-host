import mongoose from "mongoose"
// const db = process.env.DATABASE

// const db = 'mongodb://127.0.0.1:27017/zoomclone'
const db = `${process.env.MONGODB_URI}/${process.env.DB_NAME}`

if (db !== undefined) {
    mongoose.connect(db)
        .then(() => console.log('connection sucessful'))
        .catch((err: any) => console.log(err, "conn failed"))
}