import { LogError } from 'core/errors'
import { GetAllGroups } from 'core/group'
import { SyncGroupPort, syncGroupUseCase } from './SyncGroup'

export type SyncGroupPortGeneral = Omit<SyncGroupPort, 'groupId' | 'syncedAt'>
export type SyncAllGroupsPort = {
  syncedAt: Date
  getAllGroups: GetAllGroups
  syncGroupPortGeneral: SyncGroupPortGeneral
  logError: LogError
}

export type SyncAllGroupsUseCase = (port: SyncAllGroupsPort) => Promise<void>

export const syncAllGroupsUseCase: SyncAllGroupsUseCase = async ({
  syncedAt,
  getAllGroups,
  syncGroupPortGeneral,
  logError,
}) => {
  const groups = await getAllGroups()
  await Promise.all(
    groups.map((group) =>
      syncGroupUseCase({
        ...syncGroupPortGeneral,
        groupId: group._id,
        syncedAt,
      }).catch(logError)
    )
  )
}
