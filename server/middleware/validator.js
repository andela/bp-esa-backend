import { check, validationResult } from 'express-validator/check';

const getErrors = (req, next) => {
    const errors = validationResult(req)
      .array()
      .map(error => error.msg);
    if (!errors.length) {
      return next();
    }
    return errors;
  };
  
  export const handleValidation = async (req, res, next) => {
    const result = getErrors(req, next);
    return Array.isArray(result)
      ? res.status(400).json({ errors: result, message: 'validation error' })
      : result;
  };

  const isValidDate = date => !isNaN(Date.parse(date.trim()));
// "to" query go with a "from" query
const withFrom = (to, { req: { query } }) => query.from;
const isGreaterThanStartDate = (to, { req: { query } }) => new Date(to) > new Date(query.from);

  export const validateGetRates = [
    check('endDate')
      .custom(isValidDate)
      .optional()
      .withMessage('Query string: <endDate>, is not a valid date')
      .custom(withFrom)
      .optional()
      .withMessage('Query string: <endDate>, has no corresponding <startDate> query')
      .custom(isGreaterThanStartDate)
      .withMessage('End date should be greater than Start date'),
    check('startDate')
      .custom(isValidDate)
      .optional()
      .withMessage('Query string: <startDate> is not a valid date'),
    check('page')
      .isNumeric()
      .optional()
      .withMessage('Query string: <page>, is not a valid number'),
    check('limit')
      .isNumeric()
      .optional()
      .withMessage('Query string: <limit>, is not a valid number'),
  ];