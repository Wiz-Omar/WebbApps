import { pass } from "./key";

import { createConnection , Connection} from "mongoose";
async function makeConnection(): Promise<Connection> {
    return createConnection(`mongodb+srv://Grupp12Base:${pass}@cluster12.rw0756v.mongodb.net/?retryWrites=true&w=majority`);
}
export const conn: Promise<Connection> = makeConnection();

