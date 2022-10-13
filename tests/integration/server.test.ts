import { expect, it } from 'vitest'

import { name, version } from '../../package.json'
import { createServer } from '../../src/node/shared/server'

it('check that server /status endpoint is available', async () => {
  const server = createServer()
  const response = await server.inject({
    method: 'GET',
    path: '/status',
  })

  expect(response.body).toBe(`${name} ${version}`)
})
