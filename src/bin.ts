#!/usr/bin/env node
import { startServer } from './server'

startServer().then(() => console.log('Server started'))
