import * as admin from 'firebase-admin'
import 'firebase/firestore'
import { stringify } from 'json-bond'
import { batch, id, query, where, set, update } from 'typesaurus'
import { MigratedDocFunction } from './migratedDoc'
import db, { Version, VersionPreview, Page, PagePreview } from './db'

export const PACKAGE_NAME = 'date-fns'

interface MarkdownDoc {
  type: 'markdown'
  content: string
  description: string
  title: string
  category: string
  urlId: string
}

interface VersionData {
  tag: string
  date: number
  prerelease: boolean
  commit: string
  docsCategories: string[]
  docsPages: Array<MigratedDocFunction | MarkdownDoc>
}

export async function publishVersion (data: VersionData) {
  if (!process.env.SERVICE_ACCOUNT_KEY) {
    console.log('Please provide SERVICE_ACCOUNT_KEY environment variable')
    process.exit(1)
  }
  
  if (!process.env.DATABASE_URL) {
    console.log('Please provide DATABASE_URL environment variable')
    process.exit(1)
  }
  
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.SERVICE_ACCOUNT_KEY)),
    databaseURL: process.env.DATABASE_URL
  })

  const version: Version = {
    package: PACKAGE_NAME,
    version: data.tag,
    preRelease: data.prerelease,
    createdAt: data.date,
    pages: [],
    categories: data.docsCategories
  }

  const versionPreview: VersionPreview = {
    version: data.tag,
    preRelease: data.prerelease,
    createdAt: data.date
  }

  const versionPages: Page[] = []

  data.docsPages.forEach(docPage => {
    const pagePreview: PagePreview = {
      slug: docPage.urlId.replace(/\s/g, '-'),
      category: docPage.category,
      title: docPage.title,
      summary: docPage.description,
    }
    version.pages.push(pagePreview)

    if (docPage.type === 'markdown') {
      const page: Page = {
        slug: docPage.urlId.replace(/\s/g, '-'),
        category: docPage.category,
        title: docPage.title,
        summary: docPage.description,
        package: PACKAGE_NAME,
        version: data.tag,
        type: 'markdown',
        markdown: docPage.content
      }
      versionPages.push(page)
    } else if (docPage.type === 'jsdoc') {
      const page: Page = {
        slug: docPage.urlId.replace(/\s/g, '-'),
        category: docPage.category,
        title: docPage.title,
        summary: docPage.description,
        package: PACKAGE_NAME,
        version: data.tag,
        type: 'migrated',
        name: docPage.content.name,
        doc: stringify(docPage)
      }

      if (docPage.relatedDocs && docPage.isFPFn) {
        if (docPage.isFPFn) {
          page.defaultSubmodulePageSlug = docPage.relatedDocs.default
        } else {
          page.fpSubmodulePageSlug = docPage.relatedDocs.fp
        }
      }

      versionPages.push(page)
    }
  })

  const dateFns = (await query(db.packages, [where('name', '==', PACKAGE_NAME)]))[0]
  if (!dateFns) {
    throw new Error("Could not find date-fns package in storage")
  }

  const publishBatch = batch()
  publishBatch.update(db.packages, dateFns.ref.id, {
    versions: [
      ...dateFns.data.versions,
      versionPreview,
    ]
  })
  publishBatch.set(db.versions, await id(), version)
  await Promise.all(
    versionPages.map(page =>
      id().then(pageId => publishBatch.set(db.pages, pageId, page))
    )
  )
  return publishBatch.commit()
}
