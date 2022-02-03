import { makeTestGroup } from 'tests/utils'
import { GetAllGroupsPort, getAllGroupsUseCase } from './GetAllGroups'

describe('GetAllGroups', () => {
  const group1 = makeTestGroup()
  const group2 = makeTestGroup()
  const group3 = makeTestGroup()
  const groups = [group1, group2, group3]

  const defaultPort: GetAllGroupsPort = {
    getAllGroups: jest.fn(() => Promise.resolve(groups)),
    respond: jest.fn(),
  }

  it('should get all groups from the repository', async () => {
    await getAllGroupsUseCase(defaultPort)
    expect(defaultPort.getAllGroups).toHaveBeenCalled()
  })

  it('should respond with the received groups', async () => {
    await getAllGroupsUseCase(defaultPort)
    expect(defaultPort.respond).toHaveBeenCalledWith(groups)
  })
})
