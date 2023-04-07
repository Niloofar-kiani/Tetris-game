import User from "../models/user.js";
import AppError from "../errors/error.handler.js";

async function checkUsername(payload) {
    const user = await User.findOne({username: payload.username});
    if(user) {
        throw new AppError('This username already used', 409);
    }
    return {
        username:payload.username
    };
}

export default {
    checkUsername,
}