import Joi from 'joi';

export const schema = Joi.object({
    header: Joi.string().optional().allow(...[""]),
    footer: Joi.string().optional().allow(...[""]),
    dataExpr: Joi.string(),
    data: Joi.alternatives(...[Joi.string(), Joi.number()]),
    operation: Joi.string().valid(...["SUM", "MIN", "MAX", "AVG"]).optional()
}).xor("data", "dataExpr");

