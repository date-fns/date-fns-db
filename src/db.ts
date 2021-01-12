import { JSONBond } from 'json-bond'
import { collection } from 'typesaurus'
import { JSDocFunction } from './jsDoc'

export const PACKAGE_NAME = 'date-fns'

export const db = {
  packages: collection<Package>('packages'),
  versions: collection<Version>('versions'),
  pages: collection<Page>('pages'),
}

export const enum Submodule {
  Default = 'default',
  FP = 'fp',
}

export const SUBMODULES = [Submodule.Default, Submodule.FP]
export const DEFAULT_SUBMODULE = Submodule.Default

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
  submodules: Submodule[]
  pages: PagePreview[]
}

export type PagePreview = {
  submodules: Submodule[]
  slug: string
  category: string
  title: string
  summary: string
}

export type Page = {
  package: string
  version: string
  submodules: Submodule[]
  slug: string
  category: string
  title: string
  summary: string
} & (JSDocPage | MarkdownPage)

export type JSDocPage = {
  type: 'jsdoc'
  name: string
  doc: JSONBond<JSDocFunction>
}

export type MarkdownPage = {
  type: 'markdown'
  markdown: string
}
