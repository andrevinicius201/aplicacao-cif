import { Answer } from './answer';

export interface Evaluation {
    id:string;
    date:string;
    location:string;
    therapistId:string;
    patientId:string;
    answers:Answer[];
}
