export * from './contactController.service';
import { ContactControllerService } from './contactController.service';
export * from './geolocationController.service';
import { GeolocationControllerService } from './geolocationController.service';
export * from './healthCenterController.service';
import { HealthCenterControllerService } from './healthCenterController.service';
export * from './infectedKeyController.service';
import { InfectedKeyControllerService } from './infectedKeyController.service';
export * from './installationController.service';
import { InstallationControllerService } from './installationController.service';
export * from './leaveRequestController.service';
import { LeaveRequestControllerService } from './leaveRequestController.service';
export * from './meController.service';
import { MeControllerService } from './meController.service';
export * from './minVersionController.service';
import { MinVersionControllerService } from './minVersionController.service';
export * from './patientController.service';
import { PatientControllerService } from './patientController.service';
export * from './pingController.service';
import { PingControllerService } from './pingController.service';
export * from './testAppointmentController.service';
import { TestAppointmentControllerService } from './testAppointmentController.service';
export * from './testQuestionController.service';
import { TestQuestionControllerService } from './testQuestionController.service';
export * from './testResultController.service';
import { TestResultControllerService } from './testResultController.service';
export const APIS = [ContactControllerService, GeolocationControllerService, HealthCenterControllerService, InfectedKeyControllerService, InstallationControllerService, LeaveRequestControllerService, MeControllerService, MinVersionControllerService, PatientControllerService, PingControllerService, TestAppointmentControllerService, TestQuestionControllerService, TestResultControllerService];
