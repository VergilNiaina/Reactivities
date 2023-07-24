import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import { v4 as  uuid } from "uuid";
import {format} from 'date-fns';

export default class ActivityStore{

     //activities : Activity[] = [];
     activityRegistry = new Map<string, Activity>();
     selectedActivity : Activity | undefined = undefined;
     editMode  = false;
     loading = false;
     loadingInitial = false ;


     constructor(){
     makeAutoObservable(this);
     // this part work fine too but with additionnal line
     // makeObservable(this, {
     //     title:observable,
     //     // bound the function setTitle to this class using action.bound or use a arrow fuction 
     //     // setTitle =  () => {} instead of a normal function 
     //     setTitle: action
     // })
     }

     // computed
     get activitiesByDate(){
          return Array.from(this.activityRegistry.values()).sort((a,b) => 
                    a.dateTime!.getTime() - b.dateTime!.getTime())
     }
     // computed
     get groupedActivities(){
          return Object.entries(
               this.activitiesByDate.reduce((activities, activity) => {
                    const date = format(activity.dateTime!,'dd MMM yyyy');
                    activities[date] = activities[date] ?[...activities[date], activity] : [activity]
                    return activities;
               },{} as {[key:string]: Activity[]})
          )
     }

     // Action 
     loadActivities = async () =>{
          if(!this.loadingInitial) this.setLoadingInitial(true)
          try {
               const activities = await agent.Activities.list();
               // this part is needed to runInAction an action await/async OR create an another action
               activities.forEach(activity => {
                    this.setActivity(activity);
               });
               this.setLoadingInitial(false);
          } catch (error) {
               console.log(error)  
               this.setLoadingInitial(false);
          }
     }

     setLoadingInitial = (state : boolean) =>{
          this.loadingInitial = state;
     } 

     // we don't need those if using router

     // selectActivity = ( id : string) =>{
     //      //this.selectedActivity = this.activities.find( activity => activity.id===id)
     //      this.selectedActivity = this.activityRegistry.get(id);
     // }

     // cancelSelectedActivity = () => {
     //      this.selectedActivity = undefined;
     // }
     //
     // openForm = (id?: string) =>{
     //      id? this.selectActivity(id) : this.cancelSelectedActivity();
     //      this.editMode = true ;
     // }
     //
     // closeForm = () =>{
     //      this.editMode = false ;
     // }

     createActivity = async (activity : Activity) =>{
          this.loading= true;
          activity.id= uuid();
          try {
                    await agent.Activities.create(activity);
                    runInAction(()=>{
                         //this.activities.push(activity);
                         this.activityRegistry.set(activity.id,activity)
                         this.selectedActivity = activity;
                         this.editMode = false;
                         this.loading = false;
                    })
          } catch (error) {
                    console.log(error);
                    runInAction(()=>{
                         this.loading = false;
                    })
          }
     }

     updateActivity = async (activity : Activity) =>{
               this.loading= true;
               try {
                    await agent.Activities.update(activity);
                    runInAction(()=>{
                         // spread operator [...<>,<>]
                         //this.activities=[...this.activities.filter(a => a.id !== activity.id),activity];
                         this.activityRegistry.set(activity.id,activity);
                         this.selectedActivity = activity;
                         this.editMode = false;
                         this.loading = false;
                    })
               } catch (error) {
                    console.log(error);
                    runInAction(()=>{
                         this.loading = false;
                    })
               }
     }

     deleteActivity = async (id : string) =>{
          this.loading = true ;
          try {
               await agent.Activities.delete(id) ;
               runInAction(()=>{
                    //this.activities=[...this.activities.filter(a => a.id !== id)];
                    this.activityRegistry.delete(id);
                    this.loading = false ;
               })
          } catch (error) {
               console.log(error) ;
               runInAction(()=>{
                    this.loading = false ;
               })
          }
     }

     // after introducing router
     loadActivity = async (id : string) => {
          let activity = this.getActivity(id);
          if(activity){
               this.selectedActivity = activity;
               return activity;
          }
          else {
               this.setLoadingInitial(true) ;
               try {
                    activity = await agent.Activities.details(id);
                    this.setActivity(activity);
                    runInAction(()=>{
                         this.selectedActivity = activity;
                    })
                    this.setLoadingInitial(false) ;
                    return activity;
               } catch (error) {
                    console.log(error) ;
                    this.setLoadingInitial(false) ;
               }
          }
     }

     private getActivity = (id : string) => {
          return this.activityRegistry.get(id);
     }

     private setActivity = (activity : Activity) =>{
          activity.dateTime= new Date(activity.dateTime!);
          this.activityRegistry.set(activity.id,activity);
     }
}
