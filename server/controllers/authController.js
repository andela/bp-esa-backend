import jwt from 'jsonwebtoken';

/**
 * Decodes a token
 * @param {string} token provided by user
 * @returns {object} decoded token
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
 * Does Auth
 *  @param {object} req provided by user
 *  @param {object} res provided by user
 *  @returns {object} decoded token
*/
async function authResponse(req, res) {
  const { token } = req.body;
  const decode = await decodeToken(token);
  if (decode) {
    res.status(200).json({
      confirmation: 'success',
      decode,
    });
  } else {
    res.status(401).json({
      confirmation: 'fail',
      message: 'Invalid Token',
    });
  }
}

export default authResponse;
