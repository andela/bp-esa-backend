import express from 'express';
import httpProxy from 'http-proxy';
import samplePlacement from './samplePlacement';
import * as helpers from './helpers';

const router = express.Router();
const proxy = httpProxy.createProxyServer({});

const placementDatabase = {
  offboarding: [],
  onboarding: [],
};

const possiblePlacementStatus = [
  'Placed - Awaiting Onboarding',
  'External Engagements - Rolling Off',
];

const storePlacement = (placement, type) => {
  placementDatabase[type].push(placement);
};

const validatePlacementData = (req, res, next) => { // eslint-disable-line consistent-return
  const { placement } = req.body;
  if (!placement) {
    return helpers.badResponse(res, { error: 'Placement data not found' });
  }

  // Validating the placement object fields
  const requiredFields = Object.keys(samplePlacement);
  const givenFields = Object.keys(placement);
  const missingFields = [];
  requiredFields.forEach(filed => !givenFields.includes(filed) && missingFields.push(filed));
  if (missingFields.length) {
    return helpers.badResponse(res, { error: 'The placement object is missing some required fields', missingFields });
  }

  // Check if the placement don't already exist.
  let placementAlreadyExist = false;
  if (req.path === '/placement/onboarding') {
    placementAlreadyExist = helpers.checkPlacementExist(placementDatabase, placement, 'onboarding');
  }
  if (req.path === '/placement/offboarding') {
    placementAlreadyExist = helpers.checkPlacementExist(placementDatabase, placement, 'offboarding');
  }
  if (placementAlreadyExist) {
    return helpers.badResponse(res, { error: 'This placement already exist. Validated with the ID' });
  }
  next();
};

router.post('/placement/onboarding', validatePlacementData, (req, res) => {
  storePlacement(req.body.placement, 'onboarding');
  return helpers.successResponse(res, { message: 'Onboarding placement created', values: req.body.placement }, 201);
});

router.post('/placement/offboarding', validatePlacementData, (req, res) => {
  storePlacement(req.body.placement, 'offboarding');
  return helpers.successResponse(res, { message: 'Offboarding placement created', values: req.body.placement }, 201);
});


router.get('/placements', (req, res) => { // eslint-disable-line consistent-return
  const { query: { status } } = req;
  if (!status || !possiblePlacementStatus.includes(status)) {
    return helpers.badResponse(res, { error: 'status query is invalid' });
  }
  if (status === 'Placed - Awaiting Onboarding') {
    return helpers.successResponse(res, { values: placementDatabase.onboarding });
  }
  if (status === 'External Engagements - Rolling Off') {
    return helpers.successResponse(res, { values: placementDatabase.offboarding });
  }
});

router.post('/reset', (req, res) => {
  placementDatabase.offboarding = [];
  placementDatabase.onboarding = [];
  return helpers.successResponse(res, { message: 'Placement database successfully reset' });
});

router.all('*', (req, res) => {
  proxy.web(req, res, { target: 'https://api-prod.andela.com/api/v1', changeOrigin: true });
});

export default router;
