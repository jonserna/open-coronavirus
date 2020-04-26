import {Injectable} from "@angular/core";
import {ContactTrackerService} from "../contacts/contact-tracker.service";
import {InfectedKey, InfectedKeyControllerService} from "../../sdk";
import {KeyManagerService} from "./key-manager.service";
import {PatientService} from "../patient.service";
import BackgroundFetch from "cordova-plugin-background-fetch";

@Injectable()
export class KeyMatcherService {

    public constructor(protected contactTrackerService: ContactTrackerService,
                       protected patientService: PatientService,
                       protected infectedKeyControllerService: InfectedKeyControllerService,
                       protected keyManagerService: KeyManagerService) {

    }

    public async matchKeys(infectedKeys: Array<InfectedKey>) {

        let limit = 100;
        let offset = 0;

        let existsMoreRows = true;
        do {

            let entries: any = await this.contactTrackerService.getContactEntries(limit, offset);
            if (entries.rows.length > 0) {

                for (let i = 0; i < entries.rows.length; i++) {
                    let row = entries.rows.item(i);

                    for(let key of infectedKeys) {

                        let dailyKey = this.keyManagerService.generateKey(key.key, key.keyDate.getTime(), row.encryption_timestamp);
                        let decryptedTimestamp = this.keyManagerService.decrypt(dailyKey, row.encrypted_data);
                        if(decryptedTimestamp  == row.encryption_timestamp) {
                            //contact with infected!!!!
                            this.patientService.setAsQuarantine();
                            alert('contact with infected matched!'); //todo improve this way
                            return;
                        }

                    }

                }


            } else {
                existsMoreRows = false;
            }

            offset = offset + limit;

        } while (existsMoreRows);

    }


}
