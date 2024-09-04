import { Project } from './Project';

const baseUrl = 'http://localhost:4000';
const url = `${baseUrl}/projects`;

type HttpErrorInfo = {
  status: number;
  statusText: string;
  url: string;
};

interface PaginationResponse {
    first : number,
    prev : number,
    next : number,
    last : number,
    pages : number,
    items : number,
    data : Project[]
}

function translateStatusToErrorMessage(status: number): string {
  switch (status) {
    case 401:
      return 'Please login again.';
    case 403:
      return 'You do not have permission to view the project(s).';
    default:
      return 'There was an error retrieving the project(s). Please try again.';
  }
}

function checkStatus(response: Response): Response {
  if (!response.ok) {
    const httpErrorInfo: HttpErrorInfo = {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    };
    console.error('Server HTTP error:', JSON.stringify(httpErrorInfo));
    throw new Error(translateStatusToErrorMessage(httpErrorInfo.status));
  }
  console.log('Server HTTP status:', response.status);
  console.log('Server HTTP response', response);
  return response;
}

function parseJSON<T>(response: Response): Promise<T> {
  return response.json();
}

function convertData(data: PaginationResponse): Project[] {
  return data.data;
}

function convertToProjectModels(data: object[]): Project[] {
  if (!Array.isArray(data)) {
    console.error('Expected data to be an array but received:', data);
    return []; // Return an empty array or handle the error as needed
  }
  return data.map(convertToProjectModel);
}


function convertToProjectModel(item: object): Project {
  return new Project(item);
}

const projectAPI = {
    get(page : number = 1, limit : number = 20): Promise<Project[]> {
        return fetch(`${url}?_page=${page}&_per_page=${limit}&_sort=name`)
        .then(checkStatus)
        .then(response => parseJSON<PaginationResponse>(response)) 
        .then(convertData)
        .then(convertToProjectModels)
        .catch((error: Error) => {
            console.error('Client error:', error.message);
            throw new Error(
            'There was an error retrieving the projects. Please try again.'
            );
        });
    },

    put(project: Project): Promise<Project> {
        return fetch(`${url}/${project.id}`, {
            method: 'PUT',
            body: JSON.stringify(project),
            headers: {'Content-Type': 'application/json'}
        })
        .then(checkStatus)
        .then(response => parseJSON<Project>(response))
        .then(convertToProjectModel)
        .catch((error: TypeError) => {
            console.log('log client error ' + error);
            throw new Error('There was an error updating the project. Please try again.');
        },);
    },

    find(id: number): Promise<Project> {
        return fetch(`${url}/${id}`)
          .then(checkStatus)
          .then(response => parseJSON<Project>(response))
          .then(convertToProjectModel)
    },
};

export { projectAPI };
