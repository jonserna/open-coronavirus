import {Injectable} from "@angular/core";
import BackgroundFetch from "cordova-plugin-background-fetch";
import {KeyMatcherService} from "./keys/key-matcher.service";
import {InfectedKeyControllerService} from "../sdk";

@Injectable()
export class BackgroundFetchService {

    public constructor(protected infectedKeyControllerService: InfectedKeyControllerService,
                       protected keyMatcherService: KeyMatcherService) {

        BackgroundFetch.configure(this.fetchCallback, this.failureCallback, {
            minimumFetchInterval: 15, // <-- default is 15
            forceAlarmManager: true
        });

    }

    public async fetchCallback(taskId) {
        this.infectedKeyControllerService.infectedKeyControllerFind({}).subscribe(async infectedKeys => {
            try {
                await this.keyMatcherService.matchKeys(infectedKeys);
            }
            catch(error) {
                console.error("Error trying to match infected keys: " + JSON.stringify(error));
            }
            BackgroundFetch.finish(taskId);
        });
    }

    failureCallback(error) {
        console.log('- BackgroundFetch failed', error);
    };


}
