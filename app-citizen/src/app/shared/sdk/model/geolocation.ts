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


export interface Geolocation { 
  [key: string]: object | any;


    id?: string;
    latitude?: number;
    longitude?: number;
    accuracy?: number;
    altitude?: number;
    bearing?: number;
    speed?: number;
    created?: string;
    patientId: string;
}

