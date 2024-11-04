import { createContext, useState } from 'react';

export const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
    const [userCity, setUserCity] = useState(null);

    return(
        <SettingsContext.Provider value={{ userCity, setUserCity}}>
            {children}
        </SettingsContext.Provider>
    )
}