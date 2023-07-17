import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import { ServerError } from "../models/serverError";
import CommonStore from "./commonStore";

interface Store{
    activityStore: ActivityStore;
    commonStore : CommonStore;
}

// Value that we will provide from the store
export const store : Store ={
    activityStore: new ActivityStore(),
    commonStore: new CommonStore()
}

// To make sure that the store is available from reactContext
export const StoreContext =  createContext(store)

// Allow store to be use inside of our components
export function useStore(){
    return useContext(StoreContext);
}

// Next step is to provide our context to the <app/>