import { APIGatewayProxyEvent, Context } from 'aws-lambda'

export interface Props {
    event: APIGatewayProxyEvent
    context?: Context
}

export interface Response {
    statusCode: number
    body: string
}

export default class Router {
    readonly event: APIGatewayProxyEvent
    readonly context?: Context
    protected mapRouter: Map<string, Function> = new Map()

    constructor({ event, context }: Props) {
        this.event = event
        this.context = context
    }

    add(httpMethod: string, resource: string, callback: Function) {
        this.mapRouter.set(`${httpMethod}:${resource}`, callback)
    }

    async execute() {
        return this.findRoute()
    }

    private async findRoute() {
        const index = `${this.event.httpMethod}:${this.event.resource}`
        const callback = this.mapRouter.get(index)

        if (!callback) {
            return {
                statusCode: 404,
                body: 'Route not found',
            }
        }

        return callback({ event: this.event, context: this.context })
    }
}
