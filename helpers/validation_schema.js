const Joi = require('@hapi/joi');

const createWalletSchema = Joi.object({
  card_id: Joi.string().required()
});

const checkBalanceSchema = Joi.object({
  balance: Joi.number().greater(0).required()
});

const depositWithdrawSchema = Joi.object({
  amount: Joi.number().greater(0).required(),
  other_id: Joi.number().greater(0).required()
});

module.exports = {
  createWalletSchema,
  checkBalanceSchema,
  depositWithdrawSchema
}