import {
  Count,
  CountSchema,
  Filter,
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
  HttpErrors,
} from '@loopback/rest';
import { Patient } from '../models';
import { PatientRepository } from '../repositories';
import { Guid } from "guid-typescript";

export class PatientController {
  constructor(
    @repository(PatientRepository)
    public patientRepository: PatientRepository,
  ) { }

  @post('/patients', {
    responses: {
      '200': {
        description: 'Patient model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Patient) } },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Patient, {
            title: 'NewPatient',
            exclude: ['id'],
          }),
        },
      },
    })
    patient: Omit<Patient, 'id'>,
  ): Promise<Patient> {

    //generate an unique uuid for each patient
    patient.serviceAdvertisementUUID = Guid.create();
    patient.created = new Date();

    return this.patientRepository.create(patient);
  }

  @get('/patients/count', {
    responses: {
      '200': {
        description: 'Patient model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Patient)) where?: Where<Patient>,
  ): Promise<Count> {
    return this.patientRepository.count(where);
  }

  @get('/patients', {
    responses: {
      '200': {
        description: 'Array of Patient model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Patient, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Patient)) filter?: Filter<Patient>,
  ): Promise<Patient[]> {
    return this.patientRepository.find(filter);
  }

  @patch('/patients', {
    responses: {
      '200': {
        description: 'Patient PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Patient, { partial: true }),
        },
      },
    })
    patient: Patient,
    @param.query.object('where', getWhereSchemaFor(Patient)) where?: Where<Patient>,
  ): Promise<Count> {
    return this.patientRepository.updateAll(patient, where);
  }

  @post('/patients/scan/', {
    responses: {
      '204': {
        description: 'Get patient by qr-code scan',
      },
      '404': {
        description: 'Patient not found',
      },
    },
  })
  async getByQrCode(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              qrcode: { type: 'string' }
            },
            required: ['qrcode']
          }
        }
      },
    })
    body: any,
  ): Promise<Patient> {
    let filter = {
      "where": {
        "id": body.qrcode
      }
    };

    return await this.patientRepository.findOne(filter).then(patient => {
      if (patient != null) {
        return patient;
      } else {
        throw new HttpErrors[404];
      }
    });
  }

  @get('/patients/{id}', {
    responses: {
      '200': {
        description: 'Patient model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Patient, { includeRelations: true }),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(Patient)) filter?: Filter<Patient>
  ): Promise<Patient> {
    return this.patientRepository.findById(id, filter);
  }

  @patch('/patients/{id}', {
    responses: {
      '204': {
        description: 'Patient PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Patient, { partial: true }),
        },
      },
    })
    patient: Patient,
  ): Promise<void> {
    await this.patientRepository.updateById(id, patient);
  }

  @post('/patients/{id}/status', {
    responses: {
      '204': {
        description: 'Update patient status success',
      },
    },
  })
  async updateStatus(
    @param.path.string('id') id: string,
    @requestBody() status: number,
  ): Promise<void> {

    await this.patientRepository.findById(id).then(patient => {
      if (patient != null) {
        patient.status = status;
        this.patientRepository.replaceById(id, patient);
      }
    });

  }

  @post('/patients/healthInsuranceCardNumber/{healthInsuranceCardNumber}/status', {
    responses: {
      '204': {
        description: 'Update patient status success',
      },
      '404': {
        description: 'Patient not found',
      }
    },
  })
  async updateStatusByHealthInsuranceCardNumber(
    @param.path.string('healthInsuranceCardNumber') healthInsuranceCardNumber: string,
    @requestBody() status: number,
  ): Promise<void> {
    let filter = {
      "where": {
        "healthInsuranceCardNumber": healthInsuranceCardNumber
      }
    };

    await this.patientRepository.findOne(filter).then(patient => {
      if (patient != null) {
        patient.status = status;
        this.patientRepository.update(patient);
      } else {
        throw new HttpErrors[404];
      }
    });

  }

  @put('/patients/{id}', {
    responses: {
      '204': {
        description: 'Patient PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() patient: Patient,
  ): Promise<void> {
    await this.patientRepository.replaceById(id, patient);
  }

  @del('/patients/{id}', {
    responses: {
      '204': {
        description: 'Patient DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.patientRepository.deleteById(id);
  }
}
