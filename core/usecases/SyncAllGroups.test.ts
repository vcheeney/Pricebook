import { makeTestGroup, makeTestLogger } from 'tests/utils'
import {
  SyncAllGroupsPort,
  syncAllGroupsUseCase,
  SyncGroupPortGeneral,
} from './SyncAllGroups'
import { syncGroupUseCase } from './SyncGroup'

jest.mock('./SyncGroup')

describe('syncAllGroupsUseCase', () => {
  it('should call the sync group use case for each group', async () => {
    const syncedAt = new Date(2)
    const group1 = makeTestGroup()
    const group2 = makeTestGroup()
    const group3 = makeTestGroup()
    const groups = [group1, group2, group3]
    ;(<jest.Mock>syncGroupUseCase).mockReturnValue(Promise.resolve())

    const syncGroupPortGeneral: SyncGroupPortGeneral = {
      getGroupById: jest.fn(),
      getListingsByIds: jest.fn(),
      putGroup: jest.fn(),
      respond: jest.fn(),
    }

    const defaultPort: SyncAllGroupsPort = {
      syncedAt,
      getAllGroups: jest.fn().mockResolvedValue(groups),
      logError: makeTestLogger(),
      syncGroupPortGeneral,
    }

    await syncAllGroupsUseCase(defaultPort)

    expect(syncGroupUseCase).toHaveBeenCalledTimes(groups.length)
    groups.map((group) => {
      expect(syncGroupUseCase).toHaveBeenCalledWith({
        ...syncGroupPortGeneral,
        groupId: group._id,
        syncedAt,
      })
    })
  })
})
