export class TError extends Error {
    statusCode: number
}

export class BadRequestException extends TError {
    constructor(message: string) {
        super('Integration Error')
        this.name = 'BadRequestException'
        this.message = message
        this.statusCode = 400
    }
}

export class EntityNotFoundException extends TError {
    constructor(message?: string) {
        super('Integration Error')
        this.name = 'EntityNotFoundException'
        this.message = message || 'Entity not found'
        this.statusCode = 404
    }
}

export class DynamoDBException extends TError {
    constructor(error: TError) {
        super('Integration Error')
        this.name = 'DynamoDBException'
        this.message = error.message
        this.statusCode = error.statusCode || 500
    }
}
