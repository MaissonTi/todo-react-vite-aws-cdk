import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as TodoFunction from '../../src/handlers/todo-function'
import { APIGatewayProxyEvent } from 'aws-lambda'

import { Todo } from '../../src/models/todo'
import Router from '../../src/common/router'
import { DynamoDBException } from '../../src/common/exceptions'

const todo = new Todo({
    description: 'teste',
})

describe('handlers :: todo', () => {
    beforeEach(() => {
        jest.spyOn(console, 'log').mockReturnValue()
    })

    beforeEach(() => {
        jest.spyOn(DocumentClient.prototype, 'put').mockReturnValue({
            promise: jest.fn().mockResolvedValue({}),
        } as any)
        jest.spyOn(DocumentClient.prototype, 'scan').mockReturnValue({
            promise: jest.fn().mockResolvedValue({ Items: [todo] }),
        } as any)
        jest.spyOn(DocumentClient.prototype, 'get').mockReturnValue({
            promise: jest.fn().mockResolvedValue({ Item: todo }),
        } as any)
        jest.spyOn(DocumentClient.prototype, 'delete').mockReturnValue({
            promise: jest.fn().mockResolvedValue({ Attributes: todo }),
        } as any)
        jest.spyOn(DocumentClient.prototype, 'update').mockReturnValue({
            promise: jest.fn().mockResolvedValue({ Attributes: todo }),
        } as any)
    })

    describe('#handler', () => {
        const event = {
            httpMethod: 'POST',
            resource: '/todo',
            body: JSON.stringify(todo),
            requestContext: {
                requestId: '1',
            },
        } as APIGatewayProxyEvent

        it('Should return sucess', async () => {
            const spy = jest.spyOn(Router.prototype, 'execute')

            const result = await TodoFunction.handler(event, {} as any)

            expect(spy).toHaveBeenCalled()
            expect(result.statusCode).toEqual(200)
        })

        it('Should return 404', async () => {
            event.resource = '/notFound'
            const spy = jest.spyOn(Router.prototype, 'execute')

            const result = await TodoFunction.handler(event, {} as any)

            expect(spy).toHaveBeenCalled()
            expect(result.statusCode).toEqual(404)
        })
    })

    describe('#create', () => {
        const eventCreated = {
            httpMethod: 'POST',
            resource: '/todo',
            body: JSON.stringify(todo),
            requestContext: {
                requestId: '1',
            },
        } as APIGatewayProxyEvent

        it('Should return new todo', async () => {
            const result = await TodoFunction.handler(eventCreated, {} as any)
            const body = JSON.parse(result.body)

            expect(result.statusCode).toEqual(200)
            expect(body.description).toEqual(todo.description)
            expect(body.id).not.toBeUndefined()
        })

        it('Should return bad request for not exists descriptionn', async () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { description, ...todoBad } = todo
            eventCreated.body = JSON.stringify(todoBad)

            const result = await TodoFunction.handler(eventCreated, {} as any)
            expect(result.statusCode).toEqual(400)
        })

        it('Should return error in dynamodb on create', async () => {
            jest.spyOn(DocumentClient.prototype, 'put').mockReturnValueOnce({
                promise: jest.fn().mockResolvedValue(
                    Promise.reject(() => {
                        throw new Error()
                    }) as any
                ),
            } as any)

            eventCreated.body = JSON.stringify(todo)

            const result = await TodoFunction.handler(eventCreated, {} as any)
            const body = JSON.parse(result.body)

            expect(result.statusCode).toEqual(500)
            expect(body.error.type).toEqual(DynamoDBException.name)
        })
    })

    describe('#getAll', () => {
        const eventGetAll = {
            httpMethod: 'GET',
            resource: '/todo',
            requestContext: {
                requestId: '1',
            },
        } as APIGatewayProxyEvent

        it('Should return the todo', async () => {
            const result = await TodoFunction.handler(eventGetAll, {} as any)
            const body = JSON.parse(result.body) as Array<Todo>

            expect(result.statusCode).toEqual(200)
            expect(body[0].description).toEqual(todo.description)
        })

        it('Should return error in dynamodb on getAll', async () => {
            jest.spyOn(DocumentClient.prototype, 'scan').mockReturnValueOnce({
                promise: jest.fn().mockResolvedValue(
                    Promise.reject(() => {
                        throw new Error()
                    }) as any
                ),
            } as any)
            const result = await TodoFunction.handler(eventGetAll, {} as any)
            const body = JSON.parse(result.body)

            expect(result.statusCode).toEqual(500)
            expect(body.error.type).toEqual(DynamoDBException.name)
        })
    })

    describe('#getBy', () => {
        const eventGetBy = {
            httpMethod: 'GET',
            resource: '/todo/{id}',
            pathParameters: { id: '1' } as any,
            requestContext: {
                requestId: '1',
            },
        } as APIGatewayProxyEvent

        it('Should return one todo', async () => {
            const result = await TodoFunction.handler(eventGetBy, {} as any)
            const body = JSON.parse(result.body) as Todo

            expect(result.statusCode).toEqual(200)
            expect(body.description).toEqual(todo.description)
        })

        it('Should return a not found entity', async () => {
            jest.spyOn(DocumentClient.prototype, 'get').mockReturnValueOnce({
                promise: jest.fn().mockResolvedValue({ Item: undefined }),
            } as any)
            const result = await TodoFunction.handler(eventGetBy, {} as any)
            const body = JSON.parse(result.body)

            expect(result.statusCode).toEqual(404)
            expect(body.error.message).toEqual('Entity not found')
            expect(body.error.type).toEqual(DynamoDBException.name)
        })
    })

    describe('#update', () => {
        const eventUpdate = {
            httpMethod: 'PUT',
            resource: '/todo/{id}',
            pathParameters: { id: '1' } as any,
            body: JSON.stringify(todo),
            requestContext: {
                requestId: '1',
            },
        } as APIGatewayProxyEvent

        it('Should updated one todoator', async () => {
            const result = await TodoFunction.handler(eventUpdate, {} as any)
            const body = JSON.parse(result.body) as Todo

            expect(result.statusCode).toEqual(200)
            expect(body.description).toEqual(todo.description)
        })

        it('Should return error in dynamodb on update', async () => {
            jest.spyOn(DocumentClient.prototype, 'update').mockReturnValueOnce({
                promise: jest.fn().mockResolvedValue(
                    Promise.reject(() => {
                        throw new Error()
                    }) as any
                ),
            } as any)
            const result = await TodoFunction.handler(eventUpdate, {} as any)
            const body = JSON.parse(result.body)

            expect(result.statusCode).toEqual(500)
            expect(body.error.type).toEqual(DynamoDBException.name)
        })
    })

    describe('#delete', () => {
        const eventDelete = {
            httpMethod: 'DELETE',
            resource: '/todo/{id}',
            pathParameters: { id: '1' } as any,
            requestContext: {
                requestId: '1',
            },
        } as APIGatewayProxyEvent

        it('Should removed one todo', async () => {
            const result = await TodoFunction.handler(eventDelete, {} as any)
            const body = JSON.parse(result.body) as Todo

            expect(result.statusCode).toEqual(200)
            expect(body.description).toEqual(todo.description)
        })

        it('Should return a not found entity', async () => {
            jest.spyOn(DocumentClient.prototype, 'delete').mockReturnValueOnce({
                promise: jest.fn().mockResolvedValue({ Item: undefined }),
            } as any)
            const result = await TodoFunction.handler(eventDelete, {} as any)
            const body = JSON.parse(result.body)

            expect(result.statusCode).toEqual(404)
            expect(body.error.message).toEqual('Entity not found')
            expect(body.error.type).toEqual(DynamoDBException.name)
        })
    })
})
