export type InputField = {
    name: string;
    type: 'text' | 'email' | 'password';
    placeholder: string;
    id?: string;
    value?: string;
    icon: string;
};
