// The domain entity does not know the API format: the assembler converts both ways.
export class BaseAssembler {
  toEntityFromResource(resource) { throw new Error('Not implemented') }
  toResourceFromEntity(entity) { throw new Error('Not implemented') }
  toEntitiesFromResponse(response) {
    return response.data.map((resource) => this.toEntityFromResource(resource))
  }
}
