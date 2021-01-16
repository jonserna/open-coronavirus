import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PrivacityConditionsComponent} from './privacity-conditions.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [PrivacityConditionsComponent],
    exports: [PrivacityConditionsComponent]
})
export class PrivacityConditionsModule {}
