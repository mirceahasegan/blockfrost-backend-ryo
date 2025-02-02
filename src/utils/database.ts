import { PoolClient } from 'pg';
import { FastifyInstance } from 'fastify';

export const getDbSync = async (fastify: FastifyInstance): Promise<PoolClient> => {
  try {
    const clientDbSync = await fastify.pg.dbSync.connect();

    return clientDbSync;
  } catch (error) {
    console.error(`Error while connecting to DB Sync.`, error);
    throw error;
  }
};

export const gracefulRelease = (clientDbSync: PoolClient) => {
  if (!clientDbSync) return;
  try {
    clientDbSync.release();
  } catch (error) {
    console.warn(error);
  }
};
