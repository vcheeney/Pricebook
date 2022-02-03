import { makeTestGroup, makeTestUser } from 'tests/utils'
import { DeleteGroupPort, deleteGroupUseCase } from './DeleteGroup'

describe('deleteGroupUseCase', () => {
  const user = makeTestUser()
  const groupId = 'id'
  const group = makeTestGroup({ _id: groupId, userId: user._id })

  const defaultPort: DeleteGroupPort = {
    groupId,
    user,
    getGroupById: jest.fn(() => Promise.resolve(group)),
    deleteGroupById: jest.fn(),
    respond: jest.fn(),
  }

  it('should get the group by id', async () => {
    await deleteGroupUseCase(defaultPort)
    expect(defaultPort.getGroupById).toHaveBeenCalledWith(groupId)
  })

  it('should delete the group by id', async () => {
    await deleteGroupUseCase(defaultPort)
    expect(defaultPort.deleteGroupById).toHaveBeenCalledWith(groupId)
  })

  it('should respond', async () => {
    await deleteGroupUseCase(defaultPort)
    expect(defaultPort.respond).toHaveBeenCalled()
  })

  it('should throw if the group user id is not the passed user id', async () => {
    const port: DeleteGroupPort = {
      ...defaultPort,
      user: makeTestUser({ _id: 'other' }),
    }
    await expect(deleteGroupUseCase(port)).rejects.toThrow()
  })
})
