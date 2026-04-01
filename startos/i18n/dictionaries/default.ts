export const DEFAULT_LANG = 'en_US'

const dict = {
  'Starting Start9 Pages...': 0,
  Hosting: 1,
  'Ready to serve web pages': 2,
  Unavailable: 3,
  'The hosted website for ${name}': 4,
  'Folder Location': 5,
  'The full path to the Filebrowser/Nextcloud folder you want to host. If the folder contains one of: index, index.html, or index.htm files, that web page will be served.': 6,
  'Must be a valid file path': 7,
  Websites: 8,
  Name: 9,
  'A unique name to identify this website (e.g. "Marketing Site")': 10,
  Source: 11,
  'The service that contains your website files': 12,
  Nextcloud: 13,
  'Nextcloud User': 14,
  'The user account in Nextcloud where the website files are saved.': 15,
  'May only contain alphanumeric characters, hyphens, and periods.': 16,
  Filebrowser: 17,
  'Manage Websites': 18,
  'Add, edit, and remove websites': 19,
  'Add your first website!': 20,
} as const

export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
