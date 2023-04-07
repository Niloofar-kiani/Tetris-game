import express from 'express';
import scoreController from "../controllers/score.controller.js";
import {userValidation, validate, validateUsername} from "../middlewares/validate.middleware.js";
import usernameController from "../controllers/username.controller.js";

const router = express.Router();

router.post('/username', validateUsername(), validate, usernameController.checkUsername)
router.post('/score', userValidation(), validate, scoreController.saveScore);

export default router;
