import {Inject, Injectable} from "@angular/core";
import SHA256 from 'crypto-js/sha256';

@Injectable()
export class KeyStoreService {

    protected SKt = [];
    protected currentKey = null;

    public constructor() {

    }

    public generateNewKey(value) {
        let key = SHA256(value)
    }

    public rotateSK() {
        this.currentKey = this.generateNewKey(this.currentKey);
    }

}
