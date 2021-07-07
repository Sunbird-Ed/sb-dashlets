import Joi from 'joi';
import filterSchema from '../filters/schema'

export const schema = Joi.object({
    labelExpr: Joi.string(),
    labels: Joi.array().items(...[Joi.string(), Joi.number()]),
    datasets: Joi.array().items(...[Joi.object({
        label: Joi.string().required(),
        dataExpr: Joi.string(),
        data: Joi.array()
    }).options({
        allowUnknown: true
    }).xor("data", "dataExpr")]).required(),
    options: Joi.object().optional().options({ allowUnknown: true }),
    colors: Joi.alternatives(...[Joi.object(), Joi.array()]).optional(),
    filters: filterSchema.optional(),
    tooltip: Joi.object().optional(),
    responsive: Joi.boolean().optional().default(true),
    type: Joi.string().optional(),
    scales: Joi.object({
        axes: Joi.any().required()
    }).optional().options({ allowUnknown: true }),
    caption: Joi.object().optional().options({ allowUnknown: true })
}).xor("labelExpr", "labels");