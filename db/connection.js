import mongoose from "mongoose";


const connectionDB = async () => {
    return await mongoose.connect(`mongodb+srv://ahmed:ahmed123@cluster0.aapkbah.mongodb.net/${process.env.DB_NAME}`)
        .then(() => {
            console.log(`connected to database on ${process.env.DB_NAME}`)
        }).catch((err) => {
            console.log({ msg: "fail to connect", err })
        })
}

export default connectionDB


