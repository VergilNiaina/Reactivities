import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import { v4 as  uuid } from "uuid";

export default class ActivityStore{

     //activities : Activity[] = [];
     activityRegistry = new Map<string, Activity>();
     selectedActivity : Activity | undefined = undefined;
     editMode  = false;
     loading = false;
     loadingInitial = true ;


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

     //computed
     get activitiesByDate(){
          return Array.from(this.activityRegistry.values()).sort((a,b) => 
                    Date.parse(a.dateTime) - Date.parse(b.dateTime))
     }

     loadActivities = async () =>{
     try {
          const activities = await agent.Activities.list();
          // this part is needed to runInAction an action await/async OR create an another action
          activities.forEach(activity => {
               activity.dateTime= activity.dateTime.split('T')[0];
               //this.activities.push(activity);
               this.activityRegistry.set(activity.id,activity);
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

     selectActivity = ( id : string) =>{
          //this.selectedActivity = this.activities.find( activity => activity.id===id)
          this.selectedActivity = this.activityRegistry.get(id);
     }

     cancelSelectedActivity = () => {
          this.selectedActivity = undefined;
     }

     openForm = (id?: string) =>{
          id? this.selectActivity(id) : this.cancelSelectedActivity();
          this.editMode = true ;
     }

     closeForm = () =>{
          this.editMode = false ;
     }

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
                    if(this.selectedActivity?.id === id) this.cancelSelectedActivity();
                    this.loading = false ;
               })
          } catch (error) {
               console.log(error) ;
               runInAction(()=>{
                    this.loading = false ;
               })
          }
     }
}
