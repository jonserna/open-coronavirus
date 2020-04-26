import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {InfectedKey} from '../models';
import {InfectedKeyRepository} from '../repositories';

export class InfectedKeyController {
  constructor(
    @repository(InfectedKeyRepository)
    public infectedKeyRepository : InfectedKeyRepository,
  ) {}

  @post('/infected-keys', {
    responses: {
      '200': {
        description: 'InfectedKey model instance',
        content: {'application/json': {schema: getModelSchemaRef(InfectedKey)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InfectedKey, {
            title: 'NewInfectedKey',
            exclude: ['id'],
          }),
        },
      },
    })
    infectedKey: Omit<InfectedKey, 'id'>,
  ): Promise<InfectedKey> {

    infectedKey.created = new Date();

    return this.infectedKeyRepository.create(infectedKey);
  }

  @get('/infected-keys/count', {
    responses: {
      '200': {
        description: 'InfectedKey model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(InfectedKey) where?: Where<InfectedKey>,
  ): Promise<Count> {
    return this.infectedKeyRepository.count(where);
  }

  @get('/infected-keys', {
    responses: {
      '200': {
        description: 'Array of InfectedKey model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(InfectedKey, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(InfectedKey) filter?: Filter<InfectedKey>,
  ): Promise<InfectedKey[]> {
    return this.infectedKeyRepository.find(filter);
  }

  @patch('/infected-keys', {
    responses: {
      '200': {
        description: 'InfectedKey PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InfectedKey, {partial: true}),
        },
      },
    })
    infectedKey: InfectedKey,
    @param.where(InfectedKey) where?: Where<InfectedKey>,
  ): Promise<Count> {
    return this.infectedKeyRepository.updateAll(infectedKey, where);
  }

  @get('/infected-keys/{id}', {
    responses: {
      '200': {
        description: 'InfectedKey model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(InfectedKey, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(InfectedKey, {exclude: 'where'}) filter?: FilterExcludingWhere<InfectedKey>
  ): Promise<InfectedKey> {
    return this.infectedKeyRepository.findById(id, filter);
  }

  @patch('/infected-keys/{id}', {
    responses: {
      '204': {
        description: 'InfectedKey PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InfectedKey, {partial: true}),
        },
      },
    })
    infectedKey: InfectedKey,
  ): Promise<void> {
    await this.infectedKeyRepository.updateById(id, infectedKey);
  }

  @put('/infected-keys/{id}', {
    responses: {
      '204': {
        description: 'InfectedKey PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() infectedKey: InfectedKey,
  ): Promise<void> {
    await this.infectedKeyRepository.replaceById(id, infectedKey);
  }

  @del('/infected-keys/{id}', {
    responses: {
      '204': {
        description: 'InfectedKey DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.infectedKeyRepository.deleteById(id);
  }
}
