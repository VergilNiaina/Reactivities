import { useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid' 
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';
function App() {

  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitMode, setSubmitMode] = useState(false);
  
  useEffect(()=>{
    agent.Activities.list().then(response => {
      let activities : Activity[] = [];
      response.forEach(activity => {
        activity.dateTime= activity.dateTime.split('T')[0];
        activities.push(activity);
      })
      setActivities(response);
      setLoading(false);
      })
  },[]);

  function handleSelectActivity(id: string){
    setSelectedActivity(activities.find(a => a.id===id));
  }

  function handleCancelSelectActivity(){
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string){
    id? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  function handleFormClose(){
    setEditMode(false);
  }

  function handleCreateOrEditActivity(activity:Activity){
    setSubmitMode(true);
    if(activity.id){
      agent.Activities.update(activity).then(()=>{
        setActivities([...activities.filter((x) => x.id!==activity.id),activity]);
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitMode(false);
      });
    }
    else{
      activity.id=uuid();
      agent.Activities.create(activity).then(()=>{
        setActivities([...activities,activity]);
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitMode(false);
      })
    }
    // activity.id 
    //   ? setActivities([...activities.filter((x) => x.id!==activity.id),activity])
    //   : setActivities([...activities,{...activity,id:uuid()}])
  }

  function handleDeleteActivity(id:string){
    setSubmitMode(true);
    agent.Activities.delete(id).then(()=>{
      setActivities([...activities.filter(x=>x.id!==id)])
      setSelectedActivity(undefined);
      setSubmitMode(false);
    })
  }
  return (
    <>
      <NavBar openForm={handleFormOpen}/>
      {loading 
              ?<LoadingComponent content='Loading App'/>
              :<Container style={{marginTop:'7em'}}>
                <ActivityDashboard activities={activities}
                                  selectedActivity={selectedActivity}
                                  selectActivity={handleSelectActivity}
                                  cancelSelectActivity={handleCancelSelectActivity}
                                  editMode={editMode}
                                  openForm={handleFormOpen}
                                  closeForm={handleFormClose}
                                  createOrEdit={handleCreateOrEditActivity}
                                  deleteActivity={handleDeleteActivity}
                                  submitingForm={submitMode}/>
              </Container>
      }
      
    </>
  );
}

export default App;
