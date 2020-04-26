/**
 * coronavirus-server
 * coronavirus-server
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


/**
 * (Schema options: { title: \'NewPatient\', exclude: [ \'id\' ] })
 */
export interface NewPatient { 
  [key: string]: object | any;


    firstName: string;
    lastName?: string;
    documentNumber: string;
    healthInsuranceCardNumber?: string;
    birthday: string;
    age?: number;
    gender?: number;
    street?: string;
    apartment?: string;
    postalCode: string;
    email?: string;
    status?: number;
    statusDate?: string;
    phone: string;
    serviceAdvertisementUUID?: string;
    appId?: string;
    created?: string;
    updated?: string;
    autoshare?: boolean;
}

