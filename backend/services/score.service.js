import User from "../models/user.js";

async function saveScore(payload) {
    const users = await User.find();
    let newUser;
    if (users.length < 3) {
         newUser = new User({
            username: payload.username,
            score: payload.score,
        })
    }
    let existUser = false;
    for(const user of users) {
        if(user.username === payload.username) {
            existUser = true;
            if(payload.score > user.score) {
                await User.findOneAndUpdate({username: user.username}, { $set: {username: payload.username, score: payload.score}})
                break;
            }
        }
    }
    if(existUser === false) {
        for(const user of users) {
            if(payload.score > user.score) {
                await User.findOneAndUpdate({username: user.username}, { $set: {username: payload.username, score: payload.score}})
                break;
            }
        }
    }

    await newUser?.save();
    return users;
}

export default {
    saveScore,
}