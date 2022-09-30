import replyFrom from '@fastify/reply-from'
import fastify, { FastifyInstance } from 'fastify'
import nock from 'nock'

import { FileCache } from './file-cache'

export function intercept({ ttl }: { ttl?: number } = {}): () => void {
  const server = createServer({ ttl })

  nock(/.*/)
    .persist()
    .get(/.*/)
    .reply(function (_uri, _requestBody, cb) {
      server.inject(
        {
          method: 'GET',
          // @ts-expect-error The options property is not defined on the interface
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-template-expressions
          path: `/${this.req.options.href}`,
        },
        (err, response) => {
          // eslint-disable-next-line unicorn/no-null
          cb(err, [response.statusCode, response.body])
        },
      )
    })

  return () => nock.cleanAll()
}

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
