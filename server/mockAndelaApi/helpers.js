export const successResponse = (res, payload = {}, status = 200) => (
  res.status(status).json(payload));

export const badResponse = (res, payload = {}, status = 400) => (
  res.status(status).json(payload));

export const checkPlacementExist = (placementDatabase, placementToCheck, type) => (
  placementDatabase[type].some(placementData => placementData.id === placementToCheck.id)
);
