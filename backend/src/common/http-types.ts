import { APIGatewayProxyEvent } from 'aws-lambda'
import { TError } from './exceptions'

type params = {
    statusCode?: number
    message?: string
    error?: unknown
}

export function success(resp: any) {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': 'Authorization,Content-Type,X-Amz-Date,X-Amz-Security-Token,X-Api-Key',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(resp),
    }
}

export function failure(event: APIGatewayProxyEvent, params: params) {
    let name = 'Error'
    let message = params.message || 'System Error'
    let statusCode = params.statusCode || 500

    if (params.error instanceof Error) {
        message = params.error.message
        name = params.error.name
        if (params.error instanceof TError) statusCode = params.error.statusCode
    }

    const requestId = event.requestContext ? event.requestContext.requestId : 'request-id-not-found'
    console.log(`${requestId} - ${statusCode}: ${name} ${message}`)

    return {
        statusCode: statusCode || 500,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': 'Authorization,Content-Type,X-Amz-Date,X-Amz-Security-Token,X-Api-Key',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
            error: {
                type: name,
                code: statusCode,
                message,
            },
            requestId,
        }),
    }
}
