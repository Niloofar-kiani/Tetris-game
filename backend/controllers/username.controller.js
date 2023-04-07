import usernameService from "../services/username.service.js";

async function checkUsername(req, res) {
  console.log(req.body);
  try {
    res.send(await usernameService.checkUsername(req.body));
  } catch (e) {
    res.status(e.httpStatus || 400).send({message: e.message || ""});
  }
}

export default {
  checkUsername,
};
