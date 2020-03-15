import { Person } from './person';
import { Address } from './address';

export interface Patient {
    id: string;
    therapist_id: string;
    person: Person;
    address: Address;
    note: string;
    active: boolean;
}
