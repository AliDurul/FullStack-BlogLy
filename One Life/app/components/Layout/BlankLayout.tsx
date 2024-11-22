import { PropsWithChildren } from 'react';
import AppContainer from './AppContainer';


const BlankLayout = ({ children }: PropsWithChildren) => {
    return (
        <AppContainer>
            <div className="min-h-screen text-black dark:text-white-dark">{children} </div>
        </AppContainer>
    );
};

export default BlankLayout;
