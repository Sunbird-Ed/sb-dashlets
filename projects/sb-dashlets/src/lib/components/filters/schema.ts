import Joi from 'joi';

export default Joi.array().items(...[Joi.object({
    label: Joi.string().optional(),
    reference: Joi.string().required(),
    placeholder: Joi.string().optional(),
    controlType: Joi.string().valid(...["single-select", "multi-select", "date"]).required(),
    default: Joi.string().optional(),
    searchable: Joi.boolean().optional(),
    displayName: Joi.string().optional()
})])