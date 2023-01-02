import { FastifyInstance, FastifyRequest } from 'fastify';
import * as QueryTypes from '../../../types/queries/scripts';
import * as ResponseTypes from '../../../types/responses/scripts';
import { getDbSync } from '../../../utils/database';
import { handle404 } from '../../../utils/error-handler';
import { SQLQuery } from '../../../sql';
import { getSchemaForEndpoint } from '@blockfrost/openapi';

async function route(fastify: FastifyInstance) {
  fastify.route({
    url: '/scripts/:script_hash',
    schema: getSchemaForEndpoint('/scripts/{script_hash}'),
    method: 'GET',
    handler: async (request: FastifyRequest<QueryTypes.RequestParametersScriptHash>, reply) => {
      const clientDbSync = await getDbSync(fastify);

      try {
        const { rows }: { rows: ResponseTypes.ScriptHash[] } =
          await clientDbSync.query<QueryTypes.ScriptHash>(SQLQuery.get('scripts_script_hash'), [
            request.params.script_hash,
          ]);

        clientDbSync.release();

        if (rows.length === 0) {
          return handle404(reply);
        }

        return reply.send(rows[0]);
      } catch (error) {
        if (clientDbSync) {
          clientDbSync.release();
        }
        throw error;
      }
    },
  });
}

export default route;
