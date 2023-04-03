#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { TodoManagerStack } from '../infra/todo-manager-stack'

const app = new cdk.App()

const env: cdk.Environment = {
    account: process.env.AWS_ACCOUNT,
    region: process.env.AWS_REGION,
}

const tags = {
    cost: 'todolist',
    team: 'todolist-team',
}

const config = {
    env,
    tags,
}

new TodoManagerStack(app, 'ManagerStack', {
    ...config,
})
