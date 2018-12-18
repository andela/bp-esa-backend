import express from 'express';
import httpProxy from 'http-proxy';
import samplePlacement from './samplePlacement';

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

const validatePlacementData = (req, res, next) => { // eslint-disable-line consistent-return
  const { placement } = req.body;
  if (!placement) {
    return res.status(400).json({ error: 'Placement data not found' });
  }

  // Validating the placement object fields
  const requiredFields = Object.keys(samplePlacement);
  const givenFields = Object.keys(placement);
  const missingFields = [];
  requiredFields.forEach(filed => !givenFields.includes(filed) && missingFields.push(filed));
  if (missingFields.length) {
    return res.status(400).json({ error: 'The placement object is missing some required fields', missingFields });
  }

  // Check if the placement don't already exist.
  let placementAlreadyExist = false;
  if (req.path === '/placement/onboarding') {
    placementAlreadyExist = placementDatabase
      .onboarding.some(placementData => placementData.id === placement.id);
  }
  if (req.path === '/placement/offboarding') {
    placementAlreadyExist = placementDatabase
      .offboarding.some(placementData => placementData.id === placement.id);
  }
  if (placementAlreadyExist) {
    return res.status(400).json({ error: 'This placement already exist. Validated with the ID' });
  }
  next();
};

router.post('/placement/onboarding', validatePlacementData, (req, res) => {
  const { placement } = req.body;
  placementDatabase.onboarding.push(placement);
  return res.status(201).json({ message: 'Onboarding placement created', values: placement });
});

router.post('/placement/offboarding', validatePlacementData, (req, res) => {
  const { placement } = req.body;
  placementDatabase.offboarding.push(placement);
  return res.status(201).json({ message: 'Offboarding placement created', values: placement });
});


router.get('/placements', (req, res) => { // eslint-disable-line consistent-return
  const { query: { status } } = req;
  if (!status || !possiblePlacementStatus.includes(status)) {
    return res.status(400).json({ error: 'status query is invalid' });
  }
  if (status === 'Placed - Awaiting Onboarding') {
    return res.status(200).json({ values: placementDatabase.onboarding });
  }
  if (status === 'External Engagements - Rolling Off') {
    return res.status(200).json({ values: placementDatabase.offboarding });
  }
});

router.post('/reset', (req, res) => {
  placementDatabase.offboarding = [];
  placementDatabase.onboarding = [];
  return res.status(200).json({ message: 'Placement database successfully reset' });
});

router.all('*', (req, res) => {
  proxy.web(req, res, { target: 'https://api-prod.andela.com/api/v1', changeOrigin: true });
});

export default router;
