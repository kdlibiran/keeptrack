import React, { useEffect } from 'react';
import ProjectDetail from './ProjectDetail';
import { useSelector,useDispatch } from 'react-redux';
import { AppState } from '../state';
import { useParams } from 'react-router-dom';
import { loadProject } from './state/ProjectActions';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { ProjectState } from './state/ProjectTypes';
import { Project } from './Project';

type ProjectPageParams = {
    id?: string;
}

function ProjectPage(props: ProjectPageParams) {
  const loading: boolean = useSelector((appState: AppState) => appState.projectState.loading);
  const project: Project | null = useSelector((appState: AppState) => appState.projectState.project);
  const error: string | undefined = useSelector((appState: AppState) => appState.projectState.error);
  const params = useParams<ProjectPageParams>();
  const id: number = Number(params.id);

  const dispatch = useDispatch<ThunkDispatch<ProjectState, any, AnyAction>>();

  useEffect(() => {
    dispatch(loadProject(id));
  }, [dispatch]);
  
  return (
    <div>
      <>
        <h1>Project Detail</h1>

        {loading && (
          <div className="center-page">
            <span className="spinner primary"></span>
            <p>Loading...</p>
          </div>
        )}

        {error && (
          <div className="row">
            <div className="card large error">
              <section>
                <p>
                  <span className="icon-alert inverse "></span> {error}
                </p>
              </section>
            </div>
          </div>
        )}

        {project && <ProjectDetail project={project} />}
      </>
    </div>
  );
}

export default ProjectPage;