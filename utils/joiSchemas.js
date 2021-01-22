const Joi = require("joi");

module.exports.courtJoiSchema = Joi.object({
  title: Joi.string().required(),
  image: Joi.string().required().uri(),
  description: Joi.string().required(),
  location: Joi.string().required(),
  opening_hours: Joi.number().required().min(0).max(12),
  closing_hours: Joi.number().required().min(0).max(12),
  court: Joi.string().required(),
  avgNumberOfPlayers: Joi.number().required().min(0),
});
