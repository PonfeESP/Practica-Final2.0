import { Model } from 'objection';
import knex from 'knex';
import { development } from '../knexfile.js';

//Conectamos el modelo a Knex
Model.knex(knex(development));

//Definimos el modelo
export class Timing extends Model{

    // El metodo tableName() referencia el nombre de la tabla donde la que operaremos
    static get tableName(){
        return 'show_timing';
    }

    // idColumn es un metodo que permite referenciar la clave ID autogenerada
    static get idColumn(){
        return 'id';
    }

    static get jsonSchema(){
        return{
            type: 'object',
            properties:{
                id: {type: 'integer'},
                day: {type: 'integer'},
                theater_id: {type: 'integer'},
                movie_id: {type: 'integer'},
                timing_id: {type: 'integer'}
            }
        }
    }
}