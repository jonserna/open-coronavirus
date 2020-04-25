import {Injectable} from "@angular/core";
import SHA256 from 'crypto-js/sha256';
import AES from 'crypto-js/aes';
import {StorageService} from "../storage.service";
import {Guid} from "guid-typescript";

@Injectable()
export class KeyManagerService {

    protected initialSK;
    protected initialDate;
    protected currentKey = null;
    protected currentDate: Date = null;

    public static SK_KEY = 'skKey';

    public constructor(protected storageService: StorageService) {

        this.storageService.getItem(KeyManagerService.SK_KEY).subscribe(data => {
            if (data != null) {
                this.initialDate = data.initialDate;
                this.initialSK = data.initialSK;
            } else {
                this.initialSK = this.generateNewKey(Guid.create().toString());
                this.initialDate = new Date();
                this.initialDate.setHours(0, 0, 0, 0);
            }
        });

    }

    public generateNewKey(value) {
        let key = SHA256(value);

        return key;
    }

    public getDiffDays(initialTimestamp: number, endTimestamp: number) {
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.round(Math.abs((endTimestamp - initialTimestamp) / oneDay));
    }

    public getCurrentKey(): string {
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        if(this.currentDate == null || today.getTime() > this.currentDate.getTime()) {
            this.currentKey = this.generateKey(this.initialSK, this.initialDate.getTime(), today.getTime());
            this.currentDate = today;
        }
        return this.currentKey;
    }

    public generateKey(initialKey: string, initialTimestamp: number, currentTimestamp: number) {

        const diffDays = this.getDiffDays(initialTimestamp, currentTimestamp);
        for (let i = 0; i < diffDays; i++) {
            initialKey = this.generateNewKey(initialKey);
        }
        return initialKey;

    }

    public generateEncryptedKey(): EncryptedKey {
        let returnValue = new EncryptedKey();
        let currentKey = this.getCurrentKey(); //this is so secret :)
        returnValue.timestamp = new Date().getTime(); //this is going to be returned with the encrypted data
        returnValue.encryptedData = AES.encrypt(currentKey, returnValue.timestamp.toString());

        return returnValue;
    }
}

export class EncryptedKey {

    public encryptedData: string;
    public timestamp: number;

}

