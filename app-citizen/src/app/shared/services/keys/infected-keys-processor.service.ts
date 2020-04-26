import {Injectable} from "@angular/core";
import {ContactTrackerService} from "../contacts/contact-tracker.service";
import {
    InfectedKey,
    InfectedKeyControllerService,
    InfectionExposure,
    InfectionExposureControllerService
} from "../../sdk";
import {KeyManagerService} from "./key-manager.service";
import {PatientService} from "../patient.service";
import {Guid} from "guid-typescript";
import * as crypto from "crypto-js";

@Injectable()
export class InfectedKeysProcessorService {

    public constructor(protected contactTrackerService: ContactTrackerService,
                       protected patientService: PatientService,
                       protected infectionExposureControllerService: InfectionExposureControllerService,
                       protected infectedKeyControllerService: InfectedKeyControllerService,
                       protected keyManagerService: KeyManagerService) {

    }

    public async matchInfectedKeys(infectedKeys: Array<InfectedKey>) {

        let limit = 100;
        let offset = 0;

        let exposuresMatched = [];

        let sessionKey = Guid.create().toString();
        let contactEntriesMatched = [];

        let existsMoreRows = true;
        do {

            let entries: any = await this.contactTrackerService.getContactEntries(limit, offset);
            if (entries.rows.length > 0) {

                for (let i = 0; i < entries.rows.length; i++) {
                    let row = entries.rows.item(i);

                    for(let key of infectedKeys) {

                        let anonymizedInfectedUuid = crypto.AES.encrypt(key.key, sessionKey).toString();

                        let dailyKey = this.keyManagerService.generateKey(key.key, new Date(key.keyDate).getTime(), row.encryption_timestamp);
                        let decryptedTimestamp = this.keyManagerService.decrypt(dailyKey, row.encrypted_data);
                        if(decryptedTimestamp  == row.encryption_timestamp) {

                            contactEntriesMatched.push(row);

                            let infectionExposure: InfectionExposure = {
                                patientId: this.patientService.patient.id,
                                rssi: row.rssi,
                                timestampFrom: row.timestamp_from,
                                timestampTo: row.timestamp_to,
                                anonymizedInfectedUuid: anonymizedInfectedUuid
                            };

                            //contact with infected!!!!
                            exposuresMatched.push(infectionExposure);
                        }

                    }

                }

            } else {
                existsMoreRows = false;
            }

            offset = offset + limit;

        } while (existsMoreRows);

        if(exposuresMatched.length > 0) {
            //upload contacts to server
            this.infectionExposureControllerService.infectionExposureControllerCreateAll(exposuresMatched);
            this.contactTrackerService.deleteContacts(contactEntriesMatched);
        }

    }


}
