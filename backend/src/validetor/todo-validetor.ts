import { validateObject } from '../common/validetor'

const schemaCreate = {
    id: '/BodyTodo',
    type: 'object',
    properties: {
        description: { type: 'string' },
    },
    required: ['description'],
}

const schemaUpdate = {
    id: '/BodyTodo',
    type: 'object',
    properties: {
        description: { type: 'string' },
    },
    required: ['description'],
}

const create = (payload: any) => {
    return validateObject(schemaCreate, payload)
}

const update = (payload: any) => {
    return validateObject(schemaUpdate, payload)
}

export { update, create }
