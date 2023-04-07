import tetrisService from "../services/score.service.js";

async function saveScore(req, res) {
    try {
        res.send(await tetrisService.saveScore(req.body));
    } catch (e) {
        res.status(e.httpStatus || 400).send({ message: e.message || '' });
    }
}

export default {
    saveScore
}