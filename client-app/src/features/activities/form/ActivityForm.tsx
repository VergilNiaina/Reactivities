import { Button, Header, Segment } from "semantic-ui-react";
import { useEffect, useState } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Activity } from "../../../app/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import {v4 as uuid} from "uuid";

import { Formik, Form } from "formik";
import * as Yup from 'yup';
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { CatagoriesOptions } from "../../../app/common/options/categories";
import MyDateInput from "../../../app/common/form/MyDateInput";

export default observer(function ActivityForm() {
  
  const {activityStore} = useStore();
  const {createActivity, updateActivity, 
    loading, loadActivity, loadingInitial} = activityStore;

  const [activity, setActivity] = useState<Activity>({
    id:'',
    title:'',
    category:'',
    dateTime:null,
    city:'',
    description:'',
    venue:''
  });
  // get id param in the url
  const {id}= useParams();
  // to be able to navigate
  const navigate = useNavigate()
  // do something when this components loads
  useEffect(()=>{
      if(id) loadActivity(id).then(activity => setActivity(activity!))
  },[id, loadActivity]);
  

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('The activity title is required'),
    description : Yup.string().required('The activity description is required'),
    category : Yup.string().required(),
    dateTime : Yup.string().required("Date is required"),
    venue : Yup.string().required(),
    city : Yup.string().required(),
  })

  function handleFormSubmit(activity: Activity){
    if(!activity.id){
      activity.id= uuid();
      createActivity(activity).then(() => navigate(`/activities/${activity.id}`));
    } else{
      updateActivity(activity).then(() => navigate(`/activities/${activity.id}`));
    }
  }

  // function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
  //   const {name,value} = e.target;
  //   setActivity({...activity,[name]: value})
  // }
  
  if (loadingInitial) return <LoadingComponent content="Loading form"/>

  return (
    <Segment clearing>
          <Header content='Activity Details' sub color='teal'/>
          <Formik 
                initialValues={activity} 

                validationSchema={validationSchema}
                enableReinitialize 
                onSubmit={values => handleFormSubmit(values)}>
                {
                  // props from formik
                  // no need to use those values : activity, handleChange because we are using field
                  ({ handleSubmit, isSubmitting, isValid, dirty}) => (
                    <Form className="ui form" onSubmit={handleSubmit} autoComplete='off'>
                      <MyTextInput name="title" placeholder="Title"/>
                      
                      <MyTextArea  placeholder='Description' name='description' rows={3}/>
                      <MySelectInput placeholder='Category' name='category' options={CatagoriesOptions}/>
                      <MyDateInput 
                            placeholderText='Date'  
                            name='dateTime'
                            showTimeSelect
                            timeCaption="time"
                            dateFormat='MMMM d, yyyy h:mm aa'/>
                      <Header content='Location Details' sub color='teal'/>     
                      <MyTextInput placeholder='City'  name='city'/>
                      <MyTextInput placeholder='Venue'  name='venue'/>
                      <Button
                            disabled={isSubmitting || !isValid || !dirty }  
                            loading={loading} 
                            floated="right" 
                            positive type="submit" 
                            content='Submit'/>
                      <Button as={Link} to={`/activities}`}  floated="right"  content='Cancel'/>
                  </Form>
                  )
                }
          </Formik>
          
    </Segment>
  )
})
