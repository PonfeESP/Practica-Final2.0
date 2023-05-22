import {Model} from 'objection';
export default class Ventas extends Model {
    
    // Nombre de la tabla
    static tableName = 'ventas';

    // Clave primaria
    static idColumn = 'id';

    // Esquema de datos
    static get jsonSchema() {
        return {
          type: 'object',
          properties: {
            id: { type: 'string' },
            evento_id: { type: 'integer' },
            cliente_id: { type: 'integer' },
            cantidad: { type: 'number'},
            fecha_compra: { type: 'string' },
            tarjeta_credito: { type: 'string' },
            cvv: { type: 'string' },
            fecha_caducidad: { type: 'string' },
            num_entradas: { type: 'integer' },
          },
        };
    }
}