import { createContext, ReactNode, useContext, useState } from "react";
import { Field } from "../components/DynamicFormField/DynamicFormField";

interface PreviewContextProps {
  fields: Field[];
  setFields: React.Dispatch<React.SetStateAction<Field[]>>;
}

const PreviewContext  = createContext<PreviewContextProps | undefined>(undefined);

export const PreviewProvider = ({children}: {children: ReactNode}) => {
    const [fields, setFields] = useState<Field[]>([]);

    return (
        <PreviewContext.Provider value ={{fields, setFields}}>
            {children}
        </PreviewContext.Provider>
    )
    
};

export const usePreviewContext = () => {
    const context = useContext(PreviewContext);
    if (!context) throw new Error("usePreviewContext must be used within a PreviewProvider");
    return context;
}