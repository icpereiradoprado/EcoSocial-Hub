/**IMPORTS NECESSÁRIOS PARA O COMPONENTE */
import { createContext, useState } from 'react';

// Cria o contexto SettingsContext, que será usado para fornecer e consumir as configurações no aplicativo
export const SettingsContext = createContext(null);

/**
 * Componente provedor para o SettingsContext.
 * Envolve os componentes filhos e fornece o contexto de configuração, incluindo a cidade do usuário e a função para atualizá-la.
 * @param {object} children - Os componentes filhos que serão envolvidos pelo SettingsProvider.
 * @returns {JSX.Element} - O provedor do contexto que fornece userCity e setUserCity para os componentes filhos.
 */
export const SettingsProvider = ({ children }) => {
    const [userCity, setUserCity] = useState(null);

    return(
        <SettingsContext.Provider value={{ userCity, setUserCity}}>
            {children}
        </SettingsContext.Provider>
    )
}