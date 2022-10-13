import { setupWorker, rest } from 'msw'

import { name, version } from '../../package.json'

export async function intercept({ port = 9_555 }: { port: number }) {
  const response = await fetch(`http://127.0.0.1:${port}/status`)
  const body = await response.text()

  if (body === `${name} ${version}`) {
    // eslint-disable-next-line no-console
    console.info(`Connection to proxy-server established on port ${port}`)
  }

  const worker = setupWorker(
    rest.all(/\/.*\//u, async (req, res, ctx) => {
      const originalResponse = await ctx.fetch(
        `http://localhost:${port}/${req.url.href}`,
      )
      const originalResponseData = await originalResponse.text()
      // eslint-disable-next-line @typescript-eslint/return-await
      return res(ctx.body(originalResponseData))
    }),
  )

  await worker.start()
}
