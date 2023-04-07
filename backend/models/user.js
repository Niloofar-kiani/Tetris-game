import {model, Schema} from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        // unique:true,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    }
})

export default model('user', userSchema)