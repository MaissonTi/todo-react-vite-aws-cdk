import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { v4 as uuid } from 'uuid'

import { DynamoDBException, EntityNotFoundException } from './exceptions'

interface Object {
    [key: string]: any
}

export abstract class BaseRepository<T extends Object> {
    public ddbClient: DocumentClient
    public tableName: string

    constructor(ddbClient: DocumentClient, tableName: string) {
        this.ddbClient = ddbClient
        this.tableName = tableName
    }

    async getAll(): Promise<T[]> {
        try {
            const data = await this.ddbClient
                .scan({
                    TableName: this.tableName,
                })
                .promise()
            return data.Items as T[]
        } catch (error: any) {
            throw new DynamoDBException(error)
        }
    }

    async getById(id: string): Promise<T> {
        try {
            const data = await this.ddbClient
                .get({
                    TableName: this.tableName,
                    Key: {
                        id: id,
                    },
                })
                .promise()

            if (!data.Item) {
                throw new EntityNotFoundException()
            }

            return data.Item as T
        } catch (error: any) {
            throw new DynamoDBException(error)
        }
    }

    async create(payload: T): Promise<T> {
        try {
            const data = { ...payload, id: uuid(), createdAt: Date.now() } as T

            await this.ddbClient
                .put({
                    TableName: this.tableName,
                    Item: data,
                })
                .promise()
            return data
        } catch (error: any) {
            throw new DynamoDBException(error)
        }
    }

    async delete(id: string): Promise<T> {
        try {
            const data = await this.ddbClient
                .delete({
                    TableName: this.tableName,
                    Key: {
                        id: id,
                    },
                    ReturnValues: 'ALL_OLD',
                })
                .promise()
            if (!data.Attributes) {
                throw new EntityNotFoundException()
            }

            return data.Attributes as T
        } catch (error: any) {
            throw new DynamoDBException(error)
        }
    }

    async update(id: string, payload: Object): Promise<T> {
        try {
            delete payload['id']

            const { ExpressionAttributeValues, UpdateExpression } = this._createExpressionToUpdated(payload)

            const data = await this.ddbClient
                .update({
                    TableName: this.tableName,
                    Key: {
                        id: id,
                    },
                    ConditionExpression: 'attribute_exists(id)',
                    ReturnValues: 'ALL_NEW',
                    UpdateExpression,
                    ExpressionAttributeValues,
                })
                .promise()
            data.Attributes!.id = id
            return data.Attributes as T
        } catch (error: any) {
            throw new DynamoDBException(error)
        }
    }

    private _createExpressionToUpdated(payload: Object) {
        let updateExpression: String[] = []
        let expressionAttributeValues: Object = {}

        Object.keys(payload).forEach((key) => {
            let r = (Math.random() + 1).toString(36).substring(7)
            updateExpression.push(`${key} = :${r}`)
            expressionAttributeValues[`:${r}`] = payload[key]
        })

        updateExpression.push(`updatedAt = :updated`)
        expressionAttributeValues[`:updated`] = Date.now()

        return {
            UpdateExpression: `set ${updateExpression.toString()}`,
            ExpressionAttributeValues: expressionAttributeValues,
        }
    }
}
