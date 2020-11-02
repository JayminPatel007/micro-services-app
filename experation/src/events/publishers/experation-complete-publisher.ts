import {ExperationCompleteEvent, Publisher, Subjects} from "@jaymintickets/common";

export class ExperationCompletePublisher extends Publisher<ExperationCompleteEvent>{
    subject: Subjects.ExperationComplete = Subjects.ExperationComplete;

}
