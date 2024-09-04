import React, { useState } from 'react';
import { Project } from './Project';
import ProjectCard from './ProjectCard';
import ProjectForm from './ProjectForm';
interface ProjectListProps {
  projects: Project[];
}

function ProjectList({ projects }: ProjectListProps){
  const [projectBeingEdited, setProjectBeingEdited] = useState<Project | {} >({});

  const handleEdit = (project: Project): void => {
    setProjectBeingEdited(project);
  };

  const cancelEditing = (): void => {
     setProjectBeingEdited({});
  };

  const items: JSX.Element[] = projects.map((project: Project) => (
    <div key={project.id} className="cols-sm">
      {project === projectBeingEdited ? (
        <ProjectForm onCancel={cancelEditing} project={project}/>
      ) : (
        <ProjectCard project={project} onEdit={handleEdit} />
      )}
    </div>
  ));
  return <div className="row">{items}</div>;
}

export default ProjectList;
