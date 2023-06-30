import { Button, Form, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { ChangeEvent, useState } from "react";

interface Props{
  activity? :Activity
  closeForm : () => void;
  createOrEdit: (activity: Activity) => void; 
  submitingForm: boolean;
}
export default function ActivityForm({activity : selectedActivity,closeForm,createOrEdit, submitingForm}:Props) {
  const initialState = selectedActivity ?? {
    id:'',
    title:'',
    category:'',
    dateTime:'',
    city:'',
    description:'',
    venue:''
  }

  const [activity, setActivity] = useState(initialState);

  function handleSubmit(){
    console.log(activity)
    createOrEdit(activity);
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
    const {name,value} = e.target;
    setActivity({...activity,[name]: value})
  }
  

  return (
    <Segment clearing>
          <Form onSubmit={handleSubmit} autoComplete='off'>
              <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleInputChange}/>
              <Form.TextArea placeholder='Description' value={activity.description} name='description' onChange={handleInputChange}/>
              <Form.Input placeholder='Category' value={activity.category} name='category' onChange={handleInputChange}/>
              <Form.Input type="date" placeholder='Date' value={activity.dateTime} name='dateTime' onChange={handleInputChange}/>
              <Form.Input placeholder='City' value={activity.city} name='city' onChange={handleInputChange}/>
              <Form.Input placeholder='Venue' value={activity.venue} name='venue' onChange={handleInputChange}/>
              <Button loading={submitingForm} floated="right" positive type="submit" content='Submit'/>
              <Button onClick={closeForm} floated="right"  content='Cancel'/>
          </Form>
    </Segment>
  )
}
