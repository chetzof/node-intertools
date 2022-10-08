import got from 'got'
import { it } from 'vitest'

import { createServer } from '../src/shared/server'

it('test', async () => {
  const proxy = createServer({ ttl: 0 })
  await proxy.listen()
  //
  // const cors = createCorsServer({
  //   getProxyForUrl(input) {
  //     return `http://localhost:${proxy.server.address().port}/${input}`
  //   },
  // })
  // await cors.listen()
  const response = await got(
    `http://localhost:${proxy.server.address().port}/https://rei.com`,
  )
  console.log(response)
})
