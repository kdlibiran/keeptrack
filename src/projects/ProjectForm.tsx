import React,{SyntheticEvent, useState} from "react";
import {Project} from "./Project";
import { useDispatch } from 'react-redux';
import { saveProject } from './state/ProjectActions';
import { ThunkDispatch } from 'redux-thunk';
import { ProjectState } from './state/ProjectTypes';
import { AnyAction } from 'redux';

interface ProjectFormProps {
  project: Project;
  onCancel: () => void;
}

interface Errors {
  name: string,
  description: string,
  budget: string,
}

function ProjectForm({ project: initialProject, onCancel }: ProjectFormProps){
  const [project, setProject] = useState<Project>(initialProject);
  const [errors, setErrors] = useState<Errors>({
    name: '',
    description: '',
    budget: '',
  });

  const dispatch = useDispatch<ThunkDispatch<ProjectState, any, AnyAction>>();

  const handleSubmit = (event: SyntheticEvent): void => {
    event.preventDefault();
    if (!isValid()) return;
    dispatch(saveProject(project));
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    const { type, name, value } = event.target;

    let updatedValue: string | number | boolean = value;
  
    if (type === 'checkbox') {
      updatedValue = (event.target as HTMLInputElement).checked
    }
  
    if (type === 'number') {
      updatedValue = Number(updatedValue);
    }
  
    const change: { [name: string]: string | number | boolean } = {
      [name]: updatedValue,
    };
  
    let updatedProject: Project;
    setProject((p) => {
      updatedProject = new Project({ ...p, ...change });
      return updatedProject;
    });
    setErrors(() => validate(updatedProject));
  };

  function validate(project: Project): Errors {
    let errors: any = { name: '', description: '', budget: '' };
    if (project.name.length === 0) {
      errors.name = 'Name is required';
    }
    if (project.name.length > 0 && project.name.length < 3) {
      errors.name = 'Name needs to be at least 3 characters.';
    }
    if (project.description.length === 0) {
      errors.description = 'Description is required.';
    }
    if (project.budget === 0) {
      errors.budget = 'Budget must be more than $0.';
    }
    return errors;
  }

  function isValid(): boolean {
    return (
      errors.name.length === 0 &&
      errors.description.length === 0 &&
      errors.budget.length === 0
    );
  }

  return (
    <form aria-label="Edit a Project"
      name="projectForm" className="input-group vertical" onSubmit={handleSubmit}>
      <label htmlFor="name">Project Name</label>
      <input type="text" name="name" placeholder="enter name" value={project.name} onChange={handleChange} />
      {errors.name.length > 0 && (
              <div className="card error">
                <p>{errors.name}</p>
              </div>
      )}
      <label htmlFor="description">Project Description</label>
      <textarea name="description" placeholder="enter description" value={project.description} onChange={handleChange}/>
      {errors.description.length > 0 && (
              <div className="card error">
                <p>{errors.description}</p>
              </div>
      )}
      <label htmlFor="budget">Project Budget</label>
      <input type="number" name="budget" placeholder="enter budget" value={project.budget} onChange={handleChange}/>
      {errors.budget.length > 0 && (
              <div className="card error">
                <p>{errors.budget}</p>
              </div>
      )}
      <label htmlFor="isActive">Active?</label>
      <input type="checkbox" name="isActive" checked={project.isActive} onChange={handleChange}/>
      <div className="input-group">
        <button className="primary bordered medium">Save</button>
        <span />
        <button type="button" className="bordered medium"
          onClick={onCancel}
        >
          cancel
        </button>
      </div>
    </form>
  );
}

export default ProjectForm;
