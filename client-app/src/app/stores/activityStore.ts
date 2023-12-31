import { makeAutoObservable, runInAction } from "mobx";
import { Activity, ActivityFormValues } from "../models/activity";
import agent from "../api/agent";
import { v4 as  uuid } from "uuid";
import {format} from 'date-fns';
import { store } from "./store";
import { Profile } from "../models/profile";

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

     private setActivity = (activity : Activity) =>{
          const user = store.userStore.user;
          if(user)
          {
               activity.isGoing=activity.attendees!.some(
                    a => a.userName == user.userName
               )
               activity.isHost = activity.hostUserName === user.userName;
               activity.host= activity.attendees?.find(x=>x.userName == activity.hostUserName)
          }
          activity.dateTime= new Date(activity.dateTime!);
          this.activityRegistry.set(activity.id,activity);
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

     createActivity = async (activity : ActivityFormValues) =>{
          const user = store.userStore.user;
          const attendee = new Profile(user!)
          try {
                    await agent.Activities.create(activity);
                    const newActivity= new Activity(activity);
                    newActivity.hostUserName = user!.userName;
                    newActivity.attendees= [attendee];
                    this.setActivity(newActivity);
                    runInAction(()=>{
                         this.selectedActivity = newActivity;
                    })
          } catch (error) {
                    console.log(error);
          }
     }

     updateActivity = async (activity : ActivityFormValues) =>{
               try {
                    await agent.Activities.update(activity);
                    runInAction(()=>{
                         // spread operator [...<>,<>]
                         //this.activities=[...this.activities.filter(a => a.id !== activity.id),activity];
                         if(activity.id)
                         {
                              let updateActivity = {...this.getActivity(activity.id),...activity}
                              this.activityRegistry.set(activity.id,updateActivity as Activity);
                              this.selectedActivity = updateActivity as Activity;
                         }
                         
                    })
               } catch (error) {
                    console.log(error);
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

     updateAttendance = async () =>{
          const user= store.userStore.user;
          this.loading= true;
          try {
               await agent.Activities.attend(this.selectedActivity!.id);
               runInAction(()=>{
                    if(this.selectedActivity?.isGoing){
                         this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(a => a.userName!== user?.userName)
                         this.selectedActivity.isGoing=false
                    }
                    else{
                         const attendee= new Profile(user!);
                         this.selectedActivity?.attendees?.push(attendee);
                         this.selectedActivity!.isGoing= true;
                    }
                    this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!)
               })
          } catch (error) {
               console.log(error)
          } finally{
               runInAction(() => this.loading= false)
          }
     }

     cancelActivityToggle= async ()=>{
          this.loading= true;
          try{
               await agent.Activities.attend(this.selectedActivity!.id)
               runInAction(()=>
               { 
                    this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
                    this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!)
               })
          } catch(error){
               console.log(error)
          } finally{
               runInAction(()=>this.loading = false)
          }

     }
     private getActivity = (id : string) => {
          return this.activityRegistry.get(id);
     }

     
}
