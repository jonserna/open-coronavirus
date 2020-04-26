import {Injectable} from "@angular/core";
import {InstallationControllerService, InstallationWithRelations} from "../sdk";
import {BehaviorSubject, Subject} from "rxjs";
import {Device} from '@ionic-native/device/ngx';
import {Platform} from "@ionic/angular";
import {Guid} from "guid-typescript";


@Injectable()
export class InstallationService {

    public deviceId: string;
    public loadedDeviceId$ = new BehaviorSubject<boolean>(false);

    constructor(protected device: Device,
                protected platform: Platform,
                protected installationControllerService: InstallationControllerService
    ) {

        if(!!window['plugins'] && !!window['plugins'].uniqueDeviceID) {
            window['plugins'].uniqueDeviceID.get((uuid) => {
                    this.deviceId = uuid;
                    console.log("[InstallationService] device uuid: " + this.deviceId);
                    this.loadedDeviceId$.next(true);
                },
                (error) => {
                    console.error("[InstallationService] error trying to figureout device: " + JSON.stringify(error));
                });
        }
        else {
            this.deviceId = Guid.create().toString();
            console.log("[InstallationService] generating random unique device uuid: " + this.deviceId);
            this.loadedDeviceId$.next(true);
        }
    }

    public registerInstallation(patientId: string) {

        let returnValue = new Subject<boolean>();

        console.log('Register installation ...');

        console.log('Unique device ID: ' + this.deviceId);

        let installation: InstallationWithRelations = new class implements InstallationWithRelations {
            [key: string]: object | any;

            created: Date;
            deviceId: string;
            id: string;
            patientId: string;
        }

        installation.deviceId = this.deviceId;
        installation.patientId = patientId;

        console.log('Call the API to regiter the installation ...');

        this.installationControllerService.installationControllerCreate(installation).subscribe(result => {
            console.log('Installation registration successful!');
            returnValue.next(true);
        })

        return returnValue;

    }

}
