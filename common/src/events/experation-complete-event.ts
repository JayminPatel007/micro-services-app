import { Subjects } from "./subjects";

export interface ExperationCompleteEvent {
    subject: Subjects.ExperationComplete;
    data: {
        orderId: string
    }
}
