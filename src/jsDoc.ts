export type JSDocType = {
  names: string[]
}

export type JSDocTypedAttribute = {
  description: string
  type: JSDocType
}

export type JSDocException = JSDocTypedAttribute
export type JSDocReturn = JSDocTypedAttribute

export type JSDocParam = JSDocTypedAttribute & {
  name: string
  optional?: boolean
  defaultvalue?: string
  variable?: boolean
  props?: JSDocParam[]
}

export type JSDocUsage = {
  [usageTab: string]: {
    code: string
    title: string
    text?: string
  }
}

/**
 * Documentation page migrated from old date-fns.org realtime database
 */
export type JSDocFunction = {
  args?: JSDocParam[]
  category: string
  content: {
    category: string
    description: string
    examples?: string | string[]
    exceptions: JSDocException[]
    id: string
    kind: string
    longname: string
    meta: {
      filename: string
      lineno: number
      path: string
    }
    name: string
    order: number
    properties?: JSDocParam[]
    params?: JSDocParam[]
    returns?: JSDocReturn[]
    scope: string
    summary: string
    type?: JSDocType
  }
  description: string
  isFPFn?: boolean
  kind: 'function' | 'typedef'
  relatedDocs?: {
    default?: string
    fp?: string
    fpWithOptions?: string
  }
  syntax?: string
  title: string
  type: 'jsdoc'
  urlId: string
  usage?: JSDocUsage
  usageTabs?: string[]
}
