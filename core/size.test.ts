import { parseSizeString } from './size'

describe('parseSizeString', () => {
  it('should throw if string cant be parsed', () => {
    expect(() => parseSizeString('alsjdflaksdf')).toThrowError()
  })

  it('should not throw if string can be parsed', () => {
    expect(() => parseSizeString('350 g')).not.toThrowError()
  })

  test('Maxi size strings', () => {
    const packageSizes: string[] = require('../tests/maxiPackageSizes.json')
    packageSizes.forEach((str) => parseSizeString(str))
  })

  test('Provigo size strings', () => {
    const packageSizes: string[] = require('../tests/provigoPackageSizes.json')
    packageSizes.forEach((str) => parseSizeString(str))
  })

  // Some IGA sizes have not yet been integrated to the application...
  test.skip('Iga size strings', () => {
    const packageSizes: string[] = require('../tests/igaPackageSizes.json')
    packageSizes.forEach((str) => parseSizeString(str))
  })
})
