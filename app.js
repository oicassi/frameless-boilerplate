import express from 'express'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'
import logger from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import * as prismicHelpers from '@prismicio/helpers'
import * as prismic from '@prismicio/client'
import { prismicClient } from './config/prismicConfig.js'

const app = express()
const port = 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use((req, res, next) => {
  res.locals.ctx = {
    prismicHelpers,
  }
  res.locals.Link = handleLinkResolver
  next()
})

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride())

// All the routes and prismic data here are only examples

app.get('/', async (req, res) => {
  // Example fetching data using getSingle and getAllByType
  // Example fetching data
  try {
    const promises = [getDefaultData(), prismicClient.getSingle('home')]
    const [defaultData, home, collections] = await Promise.all(promises)

    res.render('pages/home', {
      ...defaultData,
      home,
      collections,
    })
  } catch (error) {
    console.log('error fetching data for home page', error)
  }
})

app.get('/about', async (req, res) => {
  // Example using predicates (using predicate it's possible to have pagination)
  // prismicClient.get({ predicates: prismic.predicate.at('document.type', 'collection') }),
  try {
    const defaultData = await getDefaultData()
    const {
      results: [about],
    } = await prismicClient.get({
      predicates: prismic.predicate.any('document.type', ['about']),
    })

    res.render('pages/about', {
      ...defaultData,
      about,
    })
  } catch (error) {
    console.log('error fetching data for about page', error)
  }
})

app.get('/contact', async (req, res) => {
  try {
    const promises = [getDefaultData(), prismicClient.getSingle('contact')]
    const [defaultData, contact] = await Promise.all(promises)

    res.render('pages/contact', {
      ...defaultData,
      contact,
    })
  } catch (error) {
    console.log('error fetching data for contact page', error)
  }
})

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})

// Helpers
const getDefaultData = async () => {
  const promises = [
    prismicClient.getSingle('meta'),
    prismicClient.getSingle('preloader'),
    prismicClient.getSingle('navigation'),
  ]

  const [meta, preloader, navigation] = await Promise.all(promises)
  return { meta, preloader, navigation }
}

const handleLinkResolver = (doc) => {
  if (doc.type === 'about') return '/about'
  /**
   * It's possible to add something like this:
   * if (doc.type === 'product') return `/detail/${doc.uid}`
   */

  return '/'
}

// More examples
/**
 * To fetch all data from prismic of one type
 * prismicClient.getAllByType('collection')
 *
 * using fetchLink to connect with related documents
 * prismicClient.getAllByType('collection', { fetchLinks: ['product.image'] })
 *
 * getting by UID and using fetchLinks
 * prismicClient.getByUID('product', uid, { fetchLinks: 'collection.full_title' })
 */
