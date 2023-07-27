import { Profile } from "./profile"

export interface Activity {
  id: string;
  title: string;
  dateTime: Date | null;
  description: string;
  category: string;
  city: string;
  venue: string;
  hostUserName:string;
  isCancelled: boolean;
  isGoing: boolean;
  isHost:boolean;
  host?:Profile;
  attendees?: Profile[];
}

export class Activity implements Activity{
      constructor(init?: ActivityFormValues){
          Object.assign(this, init)
      }
}

export class ActivityFormValues{
      id?: string = undefined;
      title: string = '';
      category: string = '';
      description : string = '';
      dateTime: Date | null = null;
      city: string= '';
      venue: string= '';


      constructor(activity?: ActivityFormValues)
      {
          if(activity){
              this.id = activity.id;
              this.title = activity.title;
              this.category = activity.category;
              this.description = activity.description;
              this.dateTime= activity.dateTime;
              this.venue = activity.venue;
              this.city = activity.city;
          }
      }
}