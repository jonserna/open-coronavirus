import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { PatientService } from '../../shared/services/patient.service';
import { PatientInfoFormComponent } from '../../shared/patient-info-form/patient-info-form.component';
import { Location } from '@angular/common';
import { ToastController } from '@ionic/angular';


@Component({
    selector: 'patient-info',
    templateUrl: 'patient-info.component.html',
    styleUrls: ['patient-info.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PatientInfoComponent {

    @ViewChild('patientInfoFormComponent', { static: true }) protected patientInfoFormComponent: PatientInfoFormComponent;


    constructor(public patientService: PatientService,
        public toastController: ToastController,
        protected location: Location) { }

    public update() {

        if (this.patientInfoFormComponent.isValid) {
            const patient = this.patientInfoFormComponent.patient;
            this.patientService.update(patient).subscribe(success => {
                if (success != null && success != false) {
                    this.presentToast();
                } else {
                    alert('Error');
                }
            });

        }

    }

    async presentToast() {
        const toast = await this.toastController.create({
            // Your changes has been saved
            message: $localize`:@@changesSavedAlert:Tus cambios se han guardado`,
            duration: 2000,
            position: 'top',
            cssClass: 'toast-class'
        });
        toast.present();
    }

    public goBack() {
        this.location.back();
    }

}
