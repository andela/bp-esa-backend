import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * @desc Decodes a token
 * @param {String} token provided by user
 * @returns {Promise} Promise to return the decoded token
 */
async function decodeToken(token) {
  try {
    const decode = await jwt.decode(token);
    return decode;
  } catch (err) {
    return false;
  }
}

/**
 * @desc Perform authentication
 *  @param {Object} req provided by user
 *  @param {Object} res provided by user
 *  @returns {Promise} Promise to return json response containing decoded token
 */
async function authResponse(req, res) {
  const { token } = req.body;
  const decode = await decodeToken(token);
  if (decode) {
    return res.status(200).json({
      confirmation: 'success',
      decode,
    });
  }
  return res.status(401).json({
    confirmation: 'fail',
    message: 'Invalid Token',
  });
}

export default authResponse;
