import { WebClient } from '@slack/client';
import { findPartnerById } from './allocations';
import makeChannelNames from '../helpers/slackHelpers';
import slackMocks from '../../test/mocks/slack';
import allocationsMocks from '../../test/mocks/allocations';


const { SLACK_TOKEN } = process.env;
const slackClient = new WebClient(SLACK_TOKEN);


/**
 * @function createChannel
 * @desc Create slack channel
 *
 * @param {string} name - Name of the channel
 * @returns {Object} - An object containing the newly created channel
 */
export const createChannel = async (name) => {
  try {
    const { create } = slackClient.groups;
    const createResult = await create({ name });

    return createResult;
  } catch (error) {
    return error;
  }
};


/**
 * @function createForPartner
 * @desc Create slack channels for a partner engagement
 *
 * @param {string} partnerId - ID of the partner
 * @returns {Object} - An object containing details of the created channels
 */
export const createPartnerChannels = async (partnerId) => {
  try {
    let partner;

    if (process.env.NODE_ENV === 'test') {
      ({ partner } = allocationsMocks);
    } else {
      partner = await findPartnerById(partnerId);
    }

    if (partner === undefined) {
      throw new Error('Partner record was not found');
    }

    const channelNames = makeChannelNames(partner.name);
    const { generalChannel, internalChannel } = channelNames;

    let createGeneral;
    let createInternal;

    if (process.env.NODE_ENV === 'test') {
      ({ createGeneral, createInternal } = slackMocks.createGroups);
    } else {
      createGeneral = await createChannel(generalChannel);
      createInternal = await createChannel(internalChannel);
    }

    const generalDuplicate = createGeneral.message !== undefined
      ? createGeneral.data.error : null;
    const internalDuplicate = createInternal.message !== undefined
      ? createInternal.data.error : null;

    if (generalDuplicate === 'name_taken') {
      throw new Error(`The channel '${generalChannel}' already exists`);
    } else if (internalDuplicate === 'name_taken') {
      throw new Error(`The channel '${internalChannel}' already exists`);
    } else if (createGeneral.ok === true && createInternal.ok === true) {
      return {
        partnerId,
        generalChannel: {
          id: createGeneral.group.id,
          name: createGeneral.group.name,
        },
        internalChannel: {
          id: createInternal.group.id,
          name: createInternal.group.name,
        },
      };
    } else {
      throw new Error('Could not create new channels');
    }
  } catch (error) {
    return error.message;
  }
};
