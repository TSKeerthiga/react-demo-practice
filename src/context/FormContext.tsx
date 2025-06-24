import { createContext, use, useContext, useState } from "react";
import { Field } from "../components/DynamicFormField/DynamicFormField";

type FormContextType = {
    fields: Field[];
    setFields: React.Dispatch<React.SetStateAction<Field[]>>;
    error: Record<string, string>;
    setError: React.Dispatch<React.SetStateAction<Record<string, string>>>;
};

const FormContext = createContext<FormContextType | undefined>(undefined);
 
export const useFormContext = () => {
    const cxt = useContext(FormContext);
    if (!cxt) throw new Error("usePreviewForm must be used within a FormProvider");
    return cxt;
};

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [fields, setFields] = useState<Field[]>([]);
    const [error, setError] = useState<Record<string, string>>({});

    return (
        <FormContext.Provider value={{fields, setFields, error, setError}}>
        {children}
        </FormContext.Provider>
    );
};
