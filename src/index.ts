import nock from 'nock'

import { createFileLogger } from './logger'
import { createServer } from './shared/server'

export function intercept ({ ttl }: { ttl?: number, } = {}): () => void {
  const logger = createFileLogger()
  const server = createServer({ logger, ttl })
  nock(/.*/u)
    .persist()
    .get(/.*/u)
    .reply(function (_uri, _requestBody, cb) {
      // @ts-expect-error The options property is not defined on the interface
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-template-expressions,@typescript-eslint/no-unsafe-assignment
      const targetURL: string = this.req.options.href

      logger.info({
        message: '--> proxy',
        method: this.req.method,
        name: 'incerceptor',
        url: targetURL,
      })
      server.inject(
        {
          method: 'GET',
          path: `/${targetURL}`,
        },
        (err, response) => {
          // eslint-disable-next-line unicorn/no-null
          cb(err, [response.statusCode, response.body])
          logger.info({
            message: '<-- proxy',
            method: this.req.method,
            name: 'incerceptor',
            statusCode: response.statusCode,
            url: targetURL,
          })
          logger.info('')
        },
      )
    })

  return () => nock.cleanAll()
}
