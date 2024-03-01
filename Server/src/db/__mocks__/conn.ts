import {MongoMemoryServer} from 'mongodb-memory-server';
import {createConnection} from 'mongoose';

async function connect() {
    const mongodb = await MongoMemoryServer.create();
    return createConnection(mongodb.getUri());
}
export const conn = connect();