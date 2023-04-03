export class Todo {
    id: string
    description: string
    createdAt: number

    constructor(values: Object = {}) {
        Object.assign(this, values)
    }
}
