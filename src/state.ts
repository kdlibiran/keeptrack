import { configureStore } from '@reduxjs/toolkit';
import { projectReducer } from './projects/state/ProjectReducer';
import { ProjectState } from './projects/state/ProjectTypes';
import { Reducer, UnknownAction } from '@reduxjs/toolkit';
// Define the shape of the whole app state
export interface AppState {
  projectState: ProjectState;
}

// Create the store
export const store = configureStore({
  reducer: {
    projectState: projectReducer as Reducer<unknown, UnknownAction ,unknown>,
  },
  // No need to specify `preloadedState` here unless you need specific initial state
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
