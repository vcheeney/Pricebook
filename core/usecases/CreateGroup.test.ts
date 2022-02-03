import { Group, validateGroup } from 'core/group'
import { Per100g } from 'core/size'
import { makeTestListingThumbnail, makeTestUser } from 'tests/utils'
import { CreateGroupPort, createGroupUseCase } from './CreateGroup'

jest.mock('core/group')

describe('CreateGroup', () => {
  const listingsThumbnail = [
    makeTestListingThumbnail({ _id: 'a' }),
    makeTestListingThumbnail({ _id: 'b' }),
  ]
  const partialGroup = {
    name: 'name',
    listingsThumbnail,
    defaultComparisonSize: Per100g,
  }
  const id = 'id'
  const createdAt = new Date(0)
  const user = makeTestUser()
  const expectedPostedGroup: Group = {
    ...partialGroup,
    _id: id,
    userId: user._id,
    createdAt,
    updatedAt: createdAt,
    syncedAt: createdAt,
    listingsThumbnail,
  }

  const defaultPort: CreateGroupPort = {
    partialGroup,
    id,
    createdAt,
    user,
    getListingsByIds: jest.fn(() => Promise.resolve(listingsThumbnail)),
    postGroup: jest.fn(() => Promise.resolve(expectedPostedGroup)),
    respond: jest.fn(),
  }

  it('should validate the created group', async () => {
    await createGroupUseCase(defaultPort)
    expect(validateGroup).toHaveBeenCalledTimes(2)
  })

  it('should get the group listings by id', async () => {
    await createGroupUseCase(defaultPort)
    expect(defaultPort.getListingsByIds).toHaveBeenCalled()
  })

  it('should post the group to the repository', async () => {
    await createGroupUseCase(defaultPort)
    expect(defaultPort.postGroup).toHaveBeenCalledWith(expectedPostedGroup)
  })

  it('should respond with the created group', async () => {
    await createGroupUseCase(defaultPort)
    expect(defaultPort.respond).toHaveBeenCalledWith(expectedPostedGroup)
  })
})
