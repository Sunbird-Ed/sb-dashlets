import Joi from 'joi';
import filterSchema from '../filters/schema'

export const schema = Joi.object({
    state: Joi.string(),
    districts: Joi.array().items(...[Joi.string()]),
    metrics: Joi.array().items(...[Joi.string()]).required(),
    folder: Joi.string().optional().default("geoJSONFiles"),
    labelExpr: Joi.string().required(),
    strict: Joi.boolean().optional().default(false),
    country: Joi.string(),
    states: Joi.array().items(...[Joi.string()]),
    initialCoordinate: Joi.array().length(2).items(...[Joi.string()]).optional(),
    latBounds: Joi.array().length(2).items(...[Joi.string()]).optional(),
    lonBounds: Joi.array().length(2).items(...[Joi.string()]).optional(),
    initialZoomLevel: Joi.alternatives(...[Joi.number, Joi.string()]).optional().default(5),
    controlTitle: Joi.string().optional().default("India Heat Map"),
    geoJSONMapping: Joi.object({
        type: Joi.string().required(),
        features: Joi.array().required()
    }).optional(),
    tileLayer: Joi.object({
        urlTemplate: Joi.string().required(),
        options: Joi.object({
            attributions: Joi.string().required()
        }).required().options({ allowUnknown: true })
    }).optional().options({ allowUnknown: true }),
    rootStyle: Joi.object().optional(),
    filters: filterSchema.optional()
}).xor("state", "country").xor("districts", "states").and("state", "districts").and("country", "states");