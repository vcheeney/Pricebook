import * as fs from 'fs'
import * as path from 'path'

export function isInTmp(path: string): boolean {
  return fs.existsSync(`.tmp/${path}`)
}

export function getFromTmp(path: string): any {
  const rawData = fs.readFileSync(`.tmp/${path}`)
  return JSON.parse(rawData.toString())
}

export function storeInTmp(filepath: string, data: any, isJson = true) {
  const dirpath = path.dirname(`.tmp/${filepath}`).split(path.sep).pop()
  if (!fs.existsSync(`.tmp/${dirpath}`)) {
    fs.mkdirSync(dirpath, { recursive: true })
  }
  fs.writeFileSync(
    `.tmp/${filepath}`,
    isJson ? JSON.stringify(data, null, 2) : data
  )
}

export function clearTmpDir(dirpath: string) {
  if (fs.existsSync(`.tmp/${dirpath}`)) {
    fs.rmdirSync(`.tmp/${dirpath}`, { recursive: true })
  }
}
