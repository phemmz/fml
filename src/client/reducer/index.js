export const LOADING = 'LOADING';
export const INITIAL_DATA = 'INITIAL_DATA';
export const SUCCESS = 'SUCCESS';
export const ADD_DATA = 'ADD_DATA';
export const UPDATE_DATA = 'UPDATE_DATA';
export const DELETE_DATA = 'DELETE_DATA';
export const ERROR = 'ERROR';
export const DONE = 'DONE';


export function reducer(state, action) {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        message: '',
        errorMessage: '',
        loading: true,
      };
    case INITIAL_DATA:
      return {
        ...state,
        initialData: action.data,
      };
    case SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.data,
      };
    case ADD_DATA:
      return {
        ...state,
        loading: false,
        message: action.message,
        data: [action.data, ...state.data],
      };
    case UPDATE_DATA:
      return {
        ...state,
        loading: false,
        data: action.data,
      };
    case DELETE_DATA:
      return {
        ...state,
        loading: false,
        data: action.data,
      };
    default:
      return {
        ...state,
        loading: false,
        errorMessage: action.message,
      };
  }
}
