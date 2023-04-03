import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import * as lambda from 'aws-lambda'

import Router, { Props, Response } from '../common/router'
import { success, failure } from '../common/http-types'

import { Todo } from '../models/todo'
import { TodoRepository } from '../provider/repository/todo-repository'
import * as todoValidetor from '../validetor/todo-validetor'

AWSXRay.captureAWS(require('aws-sdk'))

const todoTableName = process.env.TODO_TABLE_NAME!
const configDyDB = {} as AWS.DynamoDB.Types.ClientConfiguration

// To user localstack
//configDyDB.endpoint = 'http://host.docker.internal:4566'

const ddbClient = new AWS.DynamoDB.DocumentClient(configDyDB)
const todoRepository = new TodoRepository(ddbClient, todoTableName)

export async function handler(
    event: lambda.APIGatewayProxyEvent,
    context: lambda.Context
): Promise<lambda.APIGatewayProxyResult> {
    const lambdaRequestId = context.awsRequestId
    const apiRequestId = event.requestContext.requestId
    const router = new Router({ event })

    console.log(`API Gateway RequestId: ${apiRequestId} - Lambda RequestId: ${lambdaRequestId}`)

    router.add('GET', '/todo', getAll)
    router.add('POST', '/todo', create)
    router.add('GET', '/todo/{id}', getBy)
    router.add('PUT', '/todo/{id}', update)
    router.add('DELETE', '/todo/{id}', remove)

    return router.execute()
}

async function create({ event }: Props): Promise<Response> {
    console.log('POST /todo')

    const todo = new Todo(JSON.parse(event.body!))

    try {
        todoValidetor.create(todo)

        const todoCreated = await todoRepository.create(todo)

        return success(todoCreated)
    } catch (error) {
        return failure(event, { error })
    }
}

async function getBy({ event }: Props): Promise<Response> {
    const todoId = event.pathParameters!.id as string
    console.log(`GET /todo/${todoId}`)

    try {
        const todo = await todoRepository.getById(todoId)
        return success(todo)
    } catch (error) {
        return failure(event, { error })
    }
}

async function getAll({ event }: Props): Promise<Response> {
    console.log('GET /todo')

    try {
        const todo = await todoRepository.getAll()
        return success(todo)
    } catch (error) {
        return failure(event, { error })
    }
}

async function update({ event }: Props): Promise<Response> {
    const todoId = event.pathParameters!.id as string
    console.log(`PUT /todo/${todoId}`)

    const todo = new Todo(JSON.parse(event.body!))
    try {
        todoValidetor.update(todo)

        const todoUpdated = await todoRepository.update(todoId, todo)

        return success(todoUpdated)
    } catch (error) {
        return failure(event, { error })
    }
}

async function remove({ event }: Props): Promise<Response> {
    const todoId = event.pathParameters!.id as string
    console.log(`DELETE /todo/${todoId}`)
    try {
        const todo = await todoRepository.delete(todoId)
        return success(todo)
    } catch (error) {
        return failure(event, { error })
    }
}
