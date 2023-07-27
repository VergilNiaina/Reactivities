import { useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailedSideBar from "./ActivityDetailedSideBar";



export default observer(function ActivityDetails() {
  const {activityStore} = useStore();  
  const {selectedActivity : activity, loadActivity, loadingInitial} = activityStore;

  // get value from url params
  const {id} = useParams();

  useEffect(() => {
        if(id) loadActivity(id);
  },[id, loadActivity])

  if(loadingInitial || !activity) return <LoadingComponent content="Load content .."/>;

  return (
    <>
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader activity={activity}/>
                <ActivityDetailedInfo activity={activity}/>
                <ActivityDetailedChat/>
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSideBar activity={activity}/>
            </Grid.Column>
        </Grid>
    </>
  )
})
