import { Op } from "sequelize";
import moment from "moment";
import models from "../../models";
const automation = models.Automation;
const createdAt = (dateFrom, dateTo) => ({
    [Op.gte]: moment(dateFrom).startOf("day"),
    [Op.lte]: moment(dateTo).endOf("day")
});
const order = models.sequelize.literal("count DESC");
/**
 * Returns dateFunction
 * @param {string} type - boarding type
 * @param {number} offset - start value
 * @param {number} limit - number of records to pick
 * @param {string} dateFrom - start date
 * @param {string} dateTo - end date
 * @returns {object} - upselling partner record
 */
export const upsellingPartnerQuery = async (
  type,
  offset,
  limit,
  dateFrom,
  dateTo
) => {
  const val = await automation.findAndCountAll({
    attributes: [
      [models.sequelize.fn("count", models.sequelize.col("*")), "count"],
      "type",
      "partnerName"
    ],
    where: {
      createdAt: createdAt(dateFrom, dateTo),
      type
    },
    offset,
    limit,
    order,
    group: ["automation.type", "automation.partnerName"],
    raw: true
  });
  return val;
};

export const partnerStatsQuery = async (dateFrom, dateTo) => {
  return await automation.findAll({
    attributes: [
      [models.sequelize.fn("count", models.sequelize.col("*")), "count"],
      "type"
    ],
    where: {
      createdAt: createdAt(dateFrom, dateTo)
    },
    order,
    group: ["automation.type"],
    raw: true
  });
};
