import { Answer } from './answer';

export interface Evaluation {
    id:string;
    date:Date;
    location:string;
    therapistId:string;
    patientId:string;
    answers:Answer[];
}
