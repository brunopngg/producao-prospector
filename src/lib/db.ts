import { Pool } from 'pg';

// Railway internal connections don't use SSL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

// Criar tabela se não existir
export async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS registros (
        id TEXT PRIMARY KEY,
        data TIMESTAMP DEFAULT NOW(),
        prospector TEXT NOT NULL,
        polo TEXT NOT NULL,
        prefixo TEXT NOT NULL,
        trafo TEXT NOT NULL,
        visitas INTEGER NOT NULL,
        cod100 INTEGER DEFAULT 0,
        cod200 INTEGER DEFAULT 0,
        cod300 INTEGER DEFAULT 0,
        clandestino INTEGER DEFAULT 0,
        inclusao INTEGER DEFAULT 0,
        exclusao INTEGER DEFAULT 0,
        ip INTEGER DEFAULT 0,
        observacoes TEXT,
        status TEXT DEFAULT 'em_andamento',
        total_apontamentos INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Tabela registros criada/verificada com sucesso');
  } finally {
    client.release();
  }
}

export async function query<T>(text: string, params?: unknown[]): Promise<T[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
}

export async function queryOne<T>(text: string, params?: unknown[]): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] || null;
}

export default pool;
