import { Stack, StackProps, Duration } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'

export class TodoManagerStack extends Stack {
    public restApi: apigateway.RestApi
    public todoTable: dynamodb.Table
    public todoFunction: NodejsFunction

    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props)

        this.dynamodb()

        this.lambda()

        this.apigateway()
    }

    dynamodb() {
        const config = {
            tableName: 'todo',
            partitionKey: {
                name: 'id',
                type: dynamodb.AttributeType.STRING,
            },
            billingMode: dynamodb.BillingMode.PROVISIONED,
        } as dynamodb.TableProps

        this.todoTable = new dynamodb.Table(this, 'TodoTable', config)
    }

    lambda() {
        this.todoFunction = new NodejsFunction(this, 'TodoFunction', {
            functionName: 'TodoFunction',
            entry: 'src/handlers/todo-function.ts',
            memorySize: 128,
            timeout: Duration.minutes(2),
            runtime: lambda.Runtime.NODEJS_16_X,
            bundling: {
                minify: true,
                sourceMap: false,
            },
            environment: {
                TODO_TABLE_NAME: this.todoTable.tableName!,
                NODE_TLS_REJECT_UNAUTHORIZED: '0',
            },
            tracing: lambda.Tracing.ACTIVE,
            insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_119_0,
        })

        this.todoTable.grantReadWriteData(this.todoFunction)
    }

    apigateway() {
        this.restApi = new apigateway.RestApi(this, 'TodoApi', {
            restApiName: 'TodoApi',
        })

        const todoIntegration = new apigateway.LambdaIntegration(this.todoFunction)

        // [GET,POST] - /todo
        const todoResource = this.restApi.root.addResource('todo')
        todoResource.addMethod('GET', todoIntegration)
        todoResource.addMethod('POST', todoIntegration)

        // [GET,DELETE,PUT] - /todo/{id}
        const todoIdResource = todoResource.addResource('{id}')
        todoIdResource.addMethod('DELETE', todoIntegration)
        todoIdResource.addMethod('GET', todoIntegration)
        todoIdResource.addMethod('PUT', todoIntegration)

        addCorsOptions(todoResource)
        addCorsOptions(todoIdResource)
    }
}

function addCorsOptions(apiResource: apigateway.IResource) {
    apiResource.addMethod(
        'OPTIONS',
        new apigateway.MockIntegration({
            integrationResponses: [
                {
                    statusCode: '200',
                    responseParameters: {
                        'method.response.header.Access-Control-Allow-Headers':
                            "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                        'method.response.header.Access-Control-Allow-Origin': "'*'",
                        'method.response.header.Access-Control-Allow-Credentials': "'false'",
                        'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
                    },
                },
            ],
            passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
            requestTemplates: {
                'application/json': '{"statusCode": 200}',
            },
        }),
        {
            methodResponses: [
                {
                    statusCode: '200',
                    responseParameters: {
                        'method.response.header.Access-Control-Allow-Headers': true,
                        'method.response.header.Access-Control-Allow-Methods': true,
                        'method.response.header.Access-Control-Allow-Credentials': true,
                        'method.response.header.Access-Control-Allow-Origin': true,
                    },
                },
            ],
        }
    )
}
