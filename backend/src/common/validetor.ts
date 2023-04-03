import * as jsonschema from 'jsonschema'
import { BadRequestException } from './exceptions'

const Validator = jsonschema.Validator

const _buildResponseErrorMessage = (errors: Array<any>) => {
    let responseMessage = ''
    for (const element of errors) {
        const error = element
        responseMessage += error.message.replace(/"/g, '')
    }
    throw new BadRequestException(responseMessage)
}

const _validate = (schema: object, jsonObject: object) => {
    const validatorInstance = new Validator()
    let validatorResult = validatorInstance.validate(jsonObject, schema)

    if (validatorResult.errors.length > 0) {
        _buildResponseErrorMessage(validatorResult.errors)
    }

    return validatorResult.instance
}

export function validateObject(schema: object, jsonObject: object) {
    return _validate(schema, jsonObject)
}
