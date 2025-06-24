interface Option {
    value: string;
    label: string;
}

type FieldType = '' | 'text' | 'number' | 'email' | 'textarea' | 'button' | 'checkbox';

export interface Field {
    id: string;
    name: string;
    type: FieldType;
    value?: string;
    option?: Option[];
};