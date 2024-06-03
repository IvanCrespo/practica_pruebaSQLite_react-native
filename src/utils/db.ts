import {
    SQLiteDatabase,
    enablePromise,
    openDatabase,
} from 'react-native-sqlite-storage'

// Permite promesas para SQLite
enablePromise(true)

const DATABASE_NAME = 'task.db'

// Crear y abrir BD
export const connectToDatabase = async () => {
    return openDatabase(
        {name: DATABASE_NAME, location: 'default'},
        () => {},
        error => {
            console.error(error)
            throw Error('Could not connect to database')
        },
    )
}

// Crear tablas
export const createTables = async (db: SQLiteDatabase) => {
    const taskExample = `
      CREATE TABLE IF NOT EXISTS task (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title VARCHAR(200)
      )
    `
    const contactsQuery = `
     CREATE TABLE IF NOT EXISTS OtraTable (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT,
        name TEXT,
        phoneNumber TEXT
     )
    `
    try {
        await db.executeSql(taskExample)
        await db.executeSql(contactsQuery)
        console.log('Se ejecutaron las tables')
    } catch (error) {
        console.error(error)
        throw Error(`Failed to create tables`)
    }
}

// Inicializar proceso de BD
export const initDatabase = async () => {
    const db = await connectToDatabase()
    console.log('La db', db)
    await createTables(db)
    db.close()
}

// Insertar
export const addTask = async (db: SQLiteDatabase, title: string) => {
    const insertQuery = `
     INSERT INTO task (title)
     VALUES (?)
   `
    const values = [title]
    try {
        return db.executeSql(insertQuery, values)
    } catch (error) {
        console.error(error)
        throw Error('Failed to add task')
    }
}

// Obtener task
//export const getContacts = async (db: SQLiteDatabase): Promise<TipoDeTask|Contact[]> => {
    export const getTasks = async (db: SQLiteDatabase) => {
    try {
      const tasks: any = []
      const results = await db.executeSql("SELECT id, title FROM task")
      results?.forEach((resultSet) => {
        for (let index = 0; index < resultSet.rows.length; index++) {
          tasks.push(resultSet.rows.item(index))
        }
      })
      return tasks
    } catch (error) {
      console.error(error)
      throw Error("Failed to get Tasks from database")
    }
  }