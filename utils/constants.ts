import { Store } from 'core/listing'

export function getStoreColor(store: Store, opacity = 1): string {
  switch (store) {
    case Store.maxi:
      return `rgba(0, 61, 165, ${opacity})`
    case Store.provigo:
      return `rgba(242, 137, 0, ${opacity})`
    case Store.iga:
      return `rgba(234, 33, 45, ${opacity})`
    default:
      return `rgba(255, 255, 255, ${opacity})`
  }
}
