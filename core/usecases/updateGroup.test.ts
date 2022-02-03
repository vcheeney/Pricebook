import { Group, validateGroup } from 'core/group'
import {
  makeTestGroup,
  makeTestListingThumbnail,
  makeTestUser,
} from 'tests/utils'
import { UpdateGroupPort, updateGroupUseCase } from './updateGroup'

describe('UpdateGroup', () => {
  const user = makeTestUser({ _id: 'id' })
  const listingsThumbnail = [
    makeTestListingThumbnail({ _id: 'a' }),
    makeTestListingThumbnail({ _id: 'b' }),
  ]
  const updatedGroup = makeTestGroup({
    name: 'name',
    listingsThumbnail,
    userId: user._id,
  })
  const updatedAt = new Date(2)
  const expectedPutGroup: Group = {
    ...updatedGroup,
    userId: user._id,
    updatedAt,
  }

  const defaultPort: UpdateGroupPort = {
    groupId: 'id',
    updatedGroup,
    updatedAt,
    user,
    getGroupById: jest.fn(() => Promise.resolve(updatedGroup)),
    getListingsByIds: jest.fn(() => Promise.resolve(listingsThumbnail)),
    putGroup: jest.fn(() => Promise.resolve(expectedPutGroup)),
    respond: jest.fn(),
  }

  it('should get the group by id', async () => {
    await updateGroupUseCase(defaultPort)
    expect(defaultPort.getGroupById).toHaveBeenCalledWith(updatedGroup._id)
  })

  it('should get the group listings by ids', async () => {
    await updateGroupUseCase(defaultPort)
    expect(defaultPort.getListingsByIds).toHaveBeenCalled()
  })

  it('should put the group back to the repository', async () => {
    await updateGroupUseCase(defaultPort)
    expect(defaultPort.putGroup).toHaveBeenCalledWith(expectedPutGroup)
  })

  it('should respond with the updated group', async () => {
    await updateGroupUseCase(defaultPort)
    expect(defaultPort.respond).toHaveBeenCalledWith(expectedPutGroup)
  })

  it('should throw if the group user id is not the passed user id', async () => {
    const port: UpdateGroupPort = {
      ...defaultPort,
      user: makeTestUser({ _id: 'other' }),
    }
    await expect(updateGroupUseCase(port)).rejects.toThrow()
  })

  it('should throw if the group contains no listings', async () => {
    const port: UpdateGroupPort = {
      ...defaultPort,
      getListingsByIds: jest.fn(() => Promise.resolve([])),
    }
    await expect(updateGroupUseCase(port)).rejects.toThrow()
  })
})
