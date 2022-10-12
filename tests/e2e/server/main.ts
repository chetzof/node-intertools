import { intercept } from '../../../src/browser'

async function run() {
  await intercept({ port: 5_174 })
  const response = await fetch('https://example.com/')
  const body = await response.text()
  document.write(body)
}

// eslint-disable-next-line no-console
void run().then(() => console.log('done'))
