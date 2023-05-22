// Importación de objeto Modelo
import {Model} from 'objection';

// Modelos de Relación
import Evento from './Evento.model.js';
import Cliente from './Cliente.model.js';

export default class Ventas extends Model {
    
    // Nombre de la tabla
    static tableName = 'ventas';

    // Clave primaria
    static idColumn = 'id';

    // Esquema de datos
    static jsonSchema = {
        
          type: 'object',
          properties: {
            id: { type: 'string' },
            evento_id: { type: 'integer' },
            cliente_id: { type: 'integer' },
            cantidad: { type: 'number'},
            fecha_compra: { type: 'string' },
            num_entradas: { type: 'integer' },
          }
    };

    // Relaciones de Claves Foráneas
    static relationMappings = () => ({
      evento: {
        relation: Model.BelongsToOneRelation,
        modelClass: Evento,
        join: {
          from: 'ventas.evento_id',
          to: 'evento.id',
        },
      },
      cliente: {
        relation: Model.BelongsToOneRelation,
        modelClass: Cliente,
        join: {
          from: 'ventas.cliente_id',
          to: 'cliente.id',
        },
      }
    });
}