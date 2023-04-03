import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { BaseRepository } from '../../common/base-repository'
import { Todo } from '../../models/todo'

export class TodoRepository extends BaseRepository<Todo> {
    constructor(ddbClient: DocumentClient, tableName: string) {
        super(ddbClient, tableName)
    }
}
