import {body, validationResult} from "express-validator";

export const userValidation = () => [
  body("username")
    .isLength({min: 1, max: 20})
    .withMessage("Username can't be empty"),
  body("score").isNumeric().withMessage("Score can't be not a number"),
];

export const validateUsername = () => [
  body("username")
    .isLength({min: 1, max: 20})
    .withMessage("Username can't be empty"),
];

export const validate = async (req, res, next) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({[err.param]: err.msg}));

  return res.status(422).json({
    errors: extractedErrors,
  });
};
