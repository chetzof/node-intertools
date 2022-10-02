import replyFrom from '@fastify/reply-from'
import fastify, { FastifyInstance } from 'fastify'

import { FileCache } from './file-cache'

export function createServer({ ttl }: { ttl?: number } = {}): FastifyInstance {
  const server = fastify()
  const cache = new FileCache({
    ttl,
  })
  void server.register(replyFrom)
  server.all('/*', async (request, reply) => {
    const url = request.url.slice(1)
    const response = await cache.get(url)

    return !response
      ? reply.from(url, {
          async onResponse(_request, reply, res) {
            void reply.send(res)
            if (cache.ttl) {
              // @ts-expect-error The options property is not defined on the interface
              const cacheContent = (await res.text()) as string
              await cache.set(url, cacheContent)
            }
          },
        })
      : reply.send(response)
  })

  return server
}

export async function startServer(): Promise<FastifyInstance> {
  const server = createServer()

  try {
    await server.listen({ port: 3000 })
  } catch (error) {
    server.log.error(error)
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1)
  }

  return server
}
