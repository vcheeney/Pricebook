import { GetAllGroups, Group } from 'core/group'

export type GetAllGroupsPort = {
  getAllGroups: GetAllGroups
  respond: (groups: Group[]) => void
}

export type GetAllGroupsUseCase = (port: GetAllGroupsPort) => Promise<void>

export const getAllGroupsUseCase: GetAllGroupsUseCase = async ({
  getAllGroups,
  respond,
}) => {
  const groups = await getAllGroups()
  respond(groups)
}
