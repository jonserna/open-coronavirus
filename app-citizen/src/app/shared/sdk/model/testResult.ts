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


export interface TestResult { 
  [key: string]: object | any;


    id?: string;
    questionnaireId: string;
    answers?: Array<object>;
    patientId: string;
    result?: number;
    action?: number;
    created?: Date;
}

