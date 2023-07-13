import { useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';
function App() {
  const {activityStore} = useStore();
  
  useEffect(()=>{
    activityStore.loadActivities();
  },[activityStore]);

  return (
    <>
      <NavBar/>
      
      {activityStore.loadingInitial 
              ?<LoadingComponent content='Loading App'/>
              :<Container style={{marginTop:'7em'}}>
                
                <ActivityDashboard/>
              </Container>
      }
      
    </>
  );
}

// the obsever fuction mill return a new App fuction with the new change/power
export default observer(App);
