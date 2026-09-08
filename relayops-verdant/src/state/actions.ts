import { createContext, useContext } from 'react';
export type CreateOptions = { alert?: string; services?: string[] };
export const ActionsContext = createContext<{ createIncident: (options?: CreateOptions) => void; search: (query?: string) => void; go: (path: string) => void }>({ createIncident: () => {}, search: () => {}, go: () => {} });
export const useActions = () => useContext(ActionsContext);
