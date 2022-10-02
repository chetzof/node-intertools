import nock from 'nock'

import { createServer } from './server'

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
