import { Db } from 'mongodb';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {createConnection} from 'mongoose';

async function createDb() {
    return await MongoMemoryServer.create();
}

const mongodb = createDb();

async function connect() {
    return createConnection((await mongodb).getUri());
}

export async function resetDb() {
    const c = await conn;
    const db : Db = c.db;
    await (await db.collections()).forEach((collection) => {
        collection.deleteMany({})
        collection.drop()
    })
    await db.dropDatabase();
    await c.dropDatabase();
    console.log("Deleted everything (I think)")
    console.log(await db.collections());

}

export const conn = connect()