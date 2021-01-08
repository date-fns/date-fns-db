import { JSONBond } from 'json-bond'
import { collection } from 'typesaurus'
import { MigratedDocFunction } from './migratedDoc'

export const PACKAGE_NAME = 'date-fns'

export const db = {
  packages: collection<Package>('packages'),
  versions: collection<Version>('versions'),
  pages: collection<Page>('pages'),
}

export type Package = {
  name: string
  versions: VersionPreview[]
}

export type VersionPreview = {
  version: string
  preRelease: boolean
  createdAt: number
}

export type Version = {
  package: string
  version: string
  preRelease: boolean
  createdAt: number
  categories: string[]
  pages: PagePreview[]
}

export type PagePreview = {
  slug: string
  category: string
  title: string
  summary: string
}

export type Page = {
  package: string
  version: string
  slug: string
  category: string
  title: string
  summary: string
} & (MigratedDocPage | MarkdownPage)

export type MigratedDocPage = {
  type: 'migrated'
  name: string
  doc: JSONBond<MigratedDocFunction>
  defaultSubmodulePageSlug?: string
  fpSubmodulePageSlug?: string
}

export type MarkdownPage = {
  type: 'markdown'
  markdown: string
}
