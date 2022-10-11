import { setupWorker, rest } from 'msw'

export async function intercept() {
  const worker = setupWorker(
    rest.all(/\/.*\//u, async (req, res, ctx) => {
      const originalResponse = await ctx.fetch(
        'http://localhost:9000/' + req.url.href,
      )
      const originalResponseData = await originalResponse.text()
      await res(ctx.body(originalResponseData))
    }),
  )

  await worker.start()
}
