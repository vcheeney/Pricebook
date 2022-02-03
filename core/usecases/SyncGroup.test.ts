import { Group } from 'core/group'
import { makeTestGroup, makeTestListingThumbnail } from 'tests/utils'
import { SyncGroupPort, syncGroupUseCase } from './SyncGroup'

describe('SyncGroup', () => {
  const listingsThumbnail = [
    makeTestListingThumbnail({ _id: 'a' }),
    makeTestListingThumbnail({ _id: 'b' }),
  ]
  const groupId = 'id'
  const syncedAt = new Date(2)
  const group = makeTestGroup({ _id: groupId, listingsThumbnail })
  const expectedGroup: Group = {
    ...group,
    syncedAt,
  }

  const defaultPort: SyncGroupPort = {
    groupId,
    syncedAt,
    getGroupById: jest.fn().mockResolvedValue(group),
    getListingsByIds: jest.fn(() => Promise.resolve(listingsThumbnail)),
    putGroup: jest.fn(),
    respond: jest.fn(),
  }

  it('should get the group using its id', async () => {
    await syncGroupUseCase(defaultPort)
    expect(defaultPort.getGroupById).toHaveBeenCalledWith(groupId)
  })

  it('should get the group listings by id', async () => {
    await syncGroupUseCase(defaultPort)
    expect(defaultPort.getListingsByIds).toHaveBeenCalled()
  })

  it('should put the group back in the repo', async () => {
    await syncGroupUseCase(defaultPort)
    expect(defaultPort.putGroup).toHaveBeenCalledWith(expectedGroup)
  })

  it('should respond with expected group', async () => {
    await syncGroupUseCase(defaultPort)
    expect(defaultPort.respond).toHaveBeenCalledWith(expectedGroup)
  })
})
