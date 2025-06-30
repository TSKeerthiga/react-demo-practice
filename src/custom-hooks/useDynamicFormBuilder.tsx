import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";
import { useEffect, useMemo, useRef } from "react";
import { Field } from "../components/DynamicFormField/DynamicFormField";
import z, { ZodRawShape } from "zod";

export const useDynamicFormBuilder = () => {
    const { fields, setFields, error, setError } = useFormContext();
    const navigate = useNavigate();
    const lastFieldRef = useRef<HTMLDivElement>(null);
    const selectedType = ''; // from a dropdown or something

    const handleAddField = () => {
        const newField = {
            id: Date.now().toString(),
            name: '',
            type: selectedType as Field['type'],
            value: ''
        };
        setFields([...fields, newField]);
    };

    useEffect(() => {
        if (lastFieldRef.current) {
            lastFieldRef.current.focus();
        }
    }, [fields.length]);

    const handleFieldChange = (id: string, key: keyof Field, value: string) => {
        setFields(prev =>
            prev.map(field => {
                if (field.id === id) {
                    const updatedField = { ...field, [key]: value };

                    // Auto update button value
                    if (key === 'type' && value === 'button') {
                        updatedField.value = field.name;
                    }
                    if (key === 'name' && field.type === 'button') {
                        updatedField.value = value;
                    }

                    return updatedField;
                }
                return field;
            })
        );
    };

    const handleDeleteField = (id: string) => {
        setFields((prev) => prev.filter((f) => f.id !== id));
    }
    const validateSchema = useMemo(() => {
        const shape: ZodRawShape = {};
        fields.forEach(field => {
            if (field.type === 'button') return;
            if (!field.name || !field.value) return;
            switch (field.type) {
                case 'email':
                    shape[field.name] = z.string().email({ message: `${field.name} must be a valid email` });
                    break;
                case 'number':
                    shape[field.name] = z.string().refine(val => !isNaN(Number(val)), {
                        message: `${field.name} must be a number`
                    });
                    break;
                default:
                    shape[field.name] = z.string().min(1, `${field.name} is required`);
            }
        });
        return z.object(shape);
    }, [fields]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data: Record<string, string> = {};
        fields.forEach(field => {
            if (field.type !== 'button') data[field.name] = field.value || '';
        });

        try {
            validateSchema.parse(data);
            setError({});
            navigate('/preview', { state: { fields } });
        } catch (err: any) {
            const newErrors: Record<string, string> = {};
            err.errors.forEach((error: any) =>
                (newErrors[error.path[0]] = error.message));
            setError(newErrors);

        }
    };

    return {
        fields,
        error,
        handleAddField,
        handleFieldChange,
        handleSubmit,
        handleDeleteField,
        setFields,
        lastFieldRef
    };

};