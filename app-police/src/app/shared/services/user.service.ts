import { Inject, Injectable } from '@angular/core';
import { UserControllerService } from '../sdk';
import { ApiFilter } from '../utils/apifilter';
import { BehaviorSubject, Subject, Subscribable } from 'rxjs';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { UserCredentials } from '../sdk/model/userCredentials';
import { User } from '../sdk/model/user';



@Injectable()
export class UserService {

    get user(): User {
        return this._user;
    }

    set user(value: User) {
        this._user = value;
    }

    // protected activatedBackgroundGeolocation = false;

    protected userToken: string = null;
    private _user: User = null;

    public userLoaded$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

    public static USER_TOKEN_KEY = 'userToken';

    constructor(protected userController: UserControllerService,
        @Inject('environment') protected environment,
        protected router: Router,
        public platform: Platform,
        protected nativeStorage: NativeStorage) {

        platform.ready().then(() => {
            if (this.environment.production) {
                this.nativeStorage.getItem(UserService.USER_TOKEN_KEY)
                    .then(
                        data => {
                            this.loadUser(data);
                        }
                    );
            } else {
                this.loadUser('5e7497828d970a10056ef022');
            }
        });

    }

    protected loadUser(userToken) {
        this.setUserToken(userToken).subscribe(success => {
            if (success) {
                this.userLoaded$.next(true);
            } else {
                this.router.navigate(['/login']);
            }
        });
    }

    public setUserToken(userToken: string) {

        let returnValue = new Subject();

        this.userController.userControllerFindById(userToken).subscribe(user => {

            if (user != null) {
                this._user = user;
                this.userToken = userToken;
                returnValue.next(true);
            } else {
                returnValue.next(false);
            }

        });

        return returnValue;

    }

    public login(userCredentials: UserCredentials): Subscribable<any> {

        // return  this.userController.userControllerFind(new ApiFilter({ where: { email: { 'eq': userCredentials.email } } }));
        // return this.userController.userControllerFind(new ApiFilter({ email: userCredentials.email, pass: userCredentials.password }));

        let returnValue = new Subject();

        const auxtest: any = { id: 35, firstName: 'pepe' };
        this.userController.userControllerFind(new ApiFilter({ email: userCredentials.email, pass: userCredentials.password })).subscribe(res => {
            if (res) {
                this.nativeStorage.setItem(UserService.USER_TOKEN_KEY, res[0].id).then(result => { });
                this._user = auxtest;
                returnValue.next(res);
            } else {
                // returnValue.next(false);
                returnValue.next(auxtest);
            }
        }, err => {
            this._user = auxtest;
            returnValue.next(auxtest);
        });

        return returnValue;

    }


}