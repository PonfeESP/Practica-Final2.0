import {Model} from 'objection';
export default class Sales extends Model {
    
    // Nombre de la tabla
    static tableName = 'sales';

    static idColumn = 'id';

    static jsonSchema = {
        type: 'object',
        properties: {
            id:{
                type: 'string'
            },
            amount:{
                type: 'string'
            },
            client: {
                type: 'string'
            },
            event: {
                type: 'string'
            }
        }
    }
}