import { apiClient } from '../utils/apiUtils'

export default class BaseRepository {
  protected apiClient: any
  protected async getClient() {
    if (!this.apiClient) {
      this.apiClient = await apiClient()
    }
    return this.apiClient
  }
}
