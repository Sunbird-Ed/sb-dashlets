import Joi from 'joi';
import { TYPE_TO_COMPONENT_MAPPING } from './type_to_component_mapping'
const chartTypes = Object.keys(TYPE_TO_COMPONENT_MAPPING)

const getSchema = (config: Joi.ObjectSchema<any>) => Joi.object({
    type: Joi.string().required().valid(...chartTypes),
    config: config.required(),
    data: Joi.object({
        values: Joi.array(),
        location: Joi.object({
            url: Joi.string().required(),
            method: Joi.string().required(),
            options: Joi.object({
                body: Joi.object().allow(...[null]).optional(),
                headers: Joi.object().pattern(Joi.string(), Joi.alternatives(...[Joi.string(), Joi.array().items(...[Joi.string()])])).optional(),
                params: Joi.object().pattern(Joi.string(), Joi.alternatives(...[Joi.string(), Joi.array().items(...[Joi.string()])])).optional(),
                responseType: Joi.string().valid(...['arraybuffer', 'blob', 'json', 'text']),
                reportProgress: Joi.boolean().optional(),
                response: Joi.object({
                    path: Joi.string()
                }).optional()
            }).optional().options({ allowUnknown: true })
        }),
        dataSchema: Joi.object().optional()
    }).required().xor("values", "location")
})

export const defaultObjectSchemaAllowingAllKeys = Joi.object().options({ allowUnknown: true });

export const validateInputAgainstSchema = (typeBasedConfigSchema: Joi.ObjectSchema<any>) => (inputObject: object) => getSchema(typeBasedConfigSchema).validate(inputObject)