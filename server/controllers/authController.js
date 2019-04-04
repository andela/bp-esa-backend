import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const authResponse = async function (req, res, next) {
  try {
    const token = req.body.token;
    const decode = await jwt.decode(token);
    res.json({
      confirmation: 'success',
      decode,
    });
  } catch (err) {
    console.error(err);
    next(err);
    res.json({
      confirmation: 'fail',
      message: 'Invalid Token',
    });
  }
};
export default authResponse;
