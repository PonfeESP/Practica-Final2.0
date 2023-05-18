import { Model } from 'objection';
import bcrypt from 'bcryptjs';

export default class Evento extends Model {
  static tableName = 'eventos';

  static idColumn = 'id';

  static jsonSchema = {
    type: 'object',
    required: ['nombre'],

    properties: {
      id: { type: 'integer' },
      nombre: { type: 'string' },
      artista: { type: 'string' },
      ubicacion: { type: 'string' },
      aforo: { type: 'integer' },
      descripcion: { type: 'string' },
      fecha: { type: 'string' },
      precio: { type: 'number' },
      empresa_promotora_id: { type: 'integer' },
    },
  };
}