import { body } from 'express-validator'
import GetStreamMessagingChannelTypes from '../core/GetStreamMessagingChannelTypes'
import GetStreamMessagingUserRoleTypes from '../core/GetStreamMessagingUserRoleTypes'

export const tokenValidation = {
  createToken: [
    body('userId')
      .notEmpty().withMessage('User ID expected')
      .isString().withMessage('User ID must be string')
  ]
}

export const channelValidation = {
  createChannel: [
    body('type')
      .notEmpty().withMessage('Channel type expected')
      .isString().withMessage('Channel type must be string')
      .isIn(Object.values(GetStreamMessagingChannelTypes)).withMessage(`Type must be in: ${Object.values(GetStreamMessagingChannelTypes).join(', ')}`),
    body('id')
      .notEmpty().withMessage('Channel ID expected')
      .isString().withMessage('Channel ID must be string'),
    body('options')
      .isObject().withMessage('Options object expected'),
    body('options.name')
      .optional()
      .isString().withMessage('Name must be string'),
    body('options.blocked')
      .optional()
      .isBoolean().withMessage('Blocked must be boolean')
      .default(false),
    body('options.members')
      .optional()
      .isArray({ min: 2 }).withMessage('Members list must contain at least two IDs'),
    body('options.members.*')
      .notEmpty().withMessage('Member ID expected')
      .isString().withMessage('Member ID must be string')
  ],
  createChannelDistinct: [
    body('type')
      .notEmpty().withMessage('Channel type expected')
      .isString().withMessage('Channel type must be string')
      .isIn(Object.values(GetStreamMessagingChannelTypes)).withMessage(`Type must be in: ${Object.values(GetStreamMessagingChannelTypes).join(', ')}`),
    body('members')
      .isArray({ min: 2 }).withMessage('Members list must contain at least two IDs'),
    body('members.*')
      .notEmpty().withMessage('Member ID expected')
      .isString().withMessage('Member ID must be string')
  ]
}

export const userValidation = {
  createGetStreamUser: [
    body('users')
      .isArray({ min: 1 }).withMessage('Users list must contain at least one user'),
    body('users.*.id')
      .notEmpty().withMessage('User ID expected')
      .isString().withMessage('User ID must be string'),
    body('users.*.name')
      .notEmpty().withMessage('User name expected')
      .isString().withMessage('User name must be string'),
    body('users.*.role')
      .notEmpty().withMessage('User role expected')
      .isString().withMessage('User role must be string')
      .isIn(Object.values(GetStreamMessagingUserRoleTypes)).withMessage(`Role must be in: ${Object.values(GetStreamMessagingUserRoleTypes).join(', ')}`)
  ]
}
