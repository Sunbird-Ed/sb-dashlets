import Joi from 'joi';

export const schema = Joi.object({
    header: Joi.string().optional(),
    footer: Joi.string().optional(),
    dataExpr: Joi.string().required,
    operation: Joi.string().valid(["SUM", "MIN", "MAX", "AVG"]).optional()
})

