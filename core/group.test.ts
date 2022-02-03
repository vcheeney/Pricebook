import { makeTestGroup } from 'tests/utils'
import { Group, validateGroup } from './group'

describe('validateGroup', () => {
  it('should throw if field are missing', () => {
    expect(() =>
      validateGroup({ name: undefined, listingsThumbnail: [] } as Group)
    ).toThrowError()
  })

  it('should not throw if the group is valid', () => {
    const group = makeTestGroup()
    expect(() => validateGroup(group)).not.toThrow()
  })
})
