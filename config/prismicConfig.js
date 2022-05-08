import dotenv from 'dotenv'
import fetch from 'node-fetch'
import * as prismic from '@prismicio/client'
dotenv.config()

const init = () => {
  try {
    const repoName = process.env.PRISMIC_REPO
    const accessToken = process.env.PRISMIC_ACCESS_TOKEN

    if (!repoName) throw new Error('No reponame set in .env')
    if (!accessToken) throw new Error('No access token set in .env')

    const routes = [
      {
        type: 'page',
        path: '/:uid'
      }
    ]
    const client = prismic.createClient(repoName, {
      fetch,
      accessToken,
      routes
    })
    return client
  } catch (error) {
    console.log('Error configuring prismic')
    console.log(error)
    return {}
  }
}


const client = init()


export { client }
