import { pass } from "./key";

/**
 * This file is responsible for creating a connection to the MongoDB database.
 * It exports a promise that resolves to a connection object.
 */
import { createConnection , Connection} from "mongoose";
async function makeConnection(): Promise<Connection> {
    return createConnection(`mongodb+srv://Grupp12Base:${pass}@cluster12.rw0756v.mongodb.net/?retryWrites=true&w=majority`);
}
export const conn: Promise<Connection> = makeConnection();

