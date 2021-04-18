import { createPool } from "mysql2/promise";

/* Connection to mysql database */
export async function connect(){
    

    const connection =await createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'NodeJS',
        connectionLimit: 10
    })

    return connection;

}