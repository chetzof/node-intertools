import { type createServer as nodeCreateServer } from 'http'

import replyFrom from '@fastify/reply-from'
import { createServer as createCorsServer } from 'cors-anywhere'
import fastify, { type FastifyInstance, type RawServerBase } from 'fastify'

import { FileCache } from './file-cache'
import { type Logger } from './logger'

import { name, version } from '../../../package.json'

export function createServer({
  ttl,
  logger,
  cors = true,
}: Partial<{
  cors: Record<string, string> | boolean
  logger: Logger
  ttl: number
}> = {}): FastifyInstance {
  const server = fastify()
  const cache = new FileCache({
    ttl,
  })
  void server.register(replyFrom)

  const corsServer = cors
    ? createCorsServer(cors === true ? {} : cors).listen()
    : undefined

  const getMaybeProxiedURL = (
    () => (directURL: string) =>
      corsServer
        ? `http://localhost:${getServerPort(corsServer)}/${directURL}`
        : directURL
  )()

  server.get('/status', async () => `${name} ${version}`)

  server.all('/*', async (externalRequest, externalReply) => {
    const url = externalRequest.url.slice(1)
    const urlObject = new URL(url)
    const response = await cache.get(url)

    if (response) {
      logger?.info(`Found URL ${url} in cache. Serving from cache...`)
      return await externalReply.send(response)
    }

    logger?.info({
      message: `--> ${urlObject.hostname}`,
      method: externalRequest.method,
      name: 'proxy',
      url,
    })
    externalReply.from(getMaybeProxiedURL(url), {
      async onResponse(request, reply, res) {
        void reply.send(res)
        logger?.info({
          message: `<-- ${urlObject.hostname}`,
          method: externalRequest.method,
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

    // eslint-disable-next-line @typescript-eslint/return-await
    return externalReply
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
