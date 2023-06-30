import { Button, Item, Label, Segment } from "semantic-ui-react"
import { Activity } from "../../../app/models/activity"
import { SyntheticEvent, useState } from "react";

interface Props{
    activities: Activity[];
    selectActivity : (id:string) => void;
    deleteActivity: (id :  string )=> void;
    submitingForm:boolean;
}
export default function ActivityList({activities, selectActivity, deleteActivity, submitingForm}:Props) {

  const [target, setTarget] = useState('');
  // to hanlde delete from specific button
  function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement>, id:string){
    // setTarget(e.target.name);
    setTarget(e.currentTarget.name);
    deleteActivity(id);
  }
  return (
    <Segment>
        <Item.Group divided>
            {activities.map(activity =>(
                <Item key={activity.id}>
                    <Item.Content>
                        <Item.Header as='a'>{activity.title}</Item.Header>
                        <Item.Meta>{activity.dateTime}</Item.Meta>
                        <Item.Description>
                            <div>{activity.description}</div>
                            <div>{activity.city}, {activity.venue}</div>
                        </Item.Description>
                        <Item.Extra>
                            <Button floated="right" content="View" color="blue" onClick={()=>selectActivity(activity.id)}/>
                            {/* we will not only if we are submiting but also the name of the button*/}
                            <Button 
                                name={activity.id}
                                loading={submitingForm && target === activity.id} 
                                onClick={(e)=>handleActivityDelete(e,activity.id)}
                                floated="right" 
                                content="Delete" 
                                color="red" 
                                />
                            <Label basic content={activity.category}/>
                        </Item.Extra>
                    </Item.Content>
                </Item>
            ))}
        </Item.Group>
    </Segment>
  )
}
