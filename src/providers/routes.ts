export enum Routes {
    LOGIN = '/',
    LANDING = '/home',
    DIRECTORY = '/directory',
  }
  

export const RouteTitles : {[key: string]:string} = {
  [Routes.LANDING]: 'Home',
  [Routes.DIRECTORY]: 'Directory',
}