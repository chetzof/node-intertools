import { setupWorker, rest } from 'msw'

export async function intercept({ port }: { port: number }) {
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
