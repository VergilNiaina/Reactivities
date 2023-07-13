import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";

interface Store{
    activityStore: ActivityStore
}

// Value that we will provide from the store
export const store : Store ={
    activityStore: new ActivityStore()
}

// To make sure that the store is available from reactContext
export const StoreContext =  createContext(store)

// Allow store to be use inside of our components
export function useStore(){
    return useContext(StoreContext);
}

// Next step is to provide our context to the <app/>