import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import { ToastContainer } from 'react-toastify';
import { useStore } from '../stores/store';
import { useEffect } from 'react';
import ModalContainer from '../common/modals/ModalContainer';

  function App() {
  const location = useLocation();
  const {commonStore, userStore} = useStore();

  useEffect(() =>{
      
      if(commonStore.token){
          userStore.getUser().finally(()=> commonStore.setAppLoaded())
          console.log("user", userStore.user);
      }
      else{
        commonStore.setAppLoaded()
      }
  },[commonStore, userStore])

  // if(! commonStore.appLoaded) return <LoadingComponent content='Loading app...'/>

  return (
    <>
    <ModalContainer/>
    <ToastContainer position='bottom-right' hideProgressBar theme='colored'/>
    {location.pathname==='/' ? <HomePage/> : (
      <>
        <NavBar/>
        <Container style={{marginTop:'7em'}}>
            {/*before routing we have this directly here <ActivityDashboard/> */}
            {/* now we use routs so Outlet will be swapted with the component we are loading*/}
            <Outlet/>
        </Container>
      </>
    )}
    </>
  );
}

// the obsever fuction mill return a new App fuction with the new change/power
export default observer(App);
