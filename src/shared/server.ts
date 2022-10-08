import { type createServer as nodeCreateServer } from 'http'

import replyFrom from '@fastify/reply-from'
import { createServer as createCorsServer } from 'cors-anywhere'
import fastify, { type FastifyInstance, type RawServerBase } from 'fastify'

import { FileCache } from './file-cache'

import { type Logger } from '../logger'

export function createServer({
  ttl,
  logger,
}: { logger?: Logger; ttl?: number } = {}): FastifyInstance {
  const server = fastify()
  const cache = new FileCache({
    ttl,
  })
  void server.register(replyFrom)
  const cors = createCorsServer()
  cors.listen()

  server.all('/*', async (request, reply) => {
    const url = request.url.slice(1)
    const urlObject = new URL(url)
    const response = await cache.get(url)
    logger?.info('bbb')
    if (!response) {
      logger?.info({
        message: `--> ${urlObject.hostname}`,
        method: request.method,
        name: 'proxy',
        url,
      })
      reply.from(`http://localhost:${cors.address().port}/${url}`, {
        async onResponse(_request, reply, res) {
          void reply.send(res)
          logger?.info({
            message: `<-- ${urlObject.hostname}`,
            method: request.method,
            name: 'proxy',
            statusCode: reply.statusCode,
            url,
          })
          if (cache.ttl) {
            logger?.info(`The response has been cached with ttl ${cache.ttl}`)
            // @ts-expect-error The options property is not defined on the interface
            const cacheContent = (await res.text()) as string
            await cache.set(url, cacheContent)
          } else {
            logger?.info('The response will not be cached.')
          }
        },
      })
    } else {
      logger?.info(`Found URL ${url} in cache. Serving from cache...`)
      return await reply.send(response)
    }
  })

  return server
}

export function getServerPort(
  server: RawServerBase | ReturnType<typeof nodeCreateServer>,
): number {
  const address = server.address()
  if (address && typeof address === 'object') {
    return address.port
  }

  throw new Error('Cannot get server port')
}
