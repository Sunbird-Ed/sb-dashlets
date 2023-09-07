import Joi from 'joi';
import filterSchema from '../filters/schema'

export const schema = Joi.object({
    filters: filterSchema.optional(),
    columnConfig: Joi.array().items({
        title: Joi.string().required(),
        data: Joi.string().required(),
        render: Joi.function().optional(),
        index: Joi.number().optional(),
        searchable: Joi.boolean().optional(),
        orderable: Joi.boolean().optional(),
        visible: Joi.boolean().optional(),
        autoWidth: Joi.boolean().optional(),
    }).required().options({ allowUnknown: true }),
    autoWidth: Joi.boolean().optional(),
    bLengthChange: Joi.boolean().optional(),
    paging: Joi.boolean().optional(),
    bFilter: Joi.boolean().optional(),
    bInfo: Joi.boolean().optional(),
    searchable: Joi.boolean().optional(),
    info: Joi.boolean().optional(),
    order: Joi.array().optional()
}).options({ allowUnknown: true })