export const genderOp = [
    { value: 'Female', label: 'Female' },
    { value: 'Male', label: 'Male' },
];
export const familyOp = [
    { value: 'Extended', label: 'Extended' },
    { value: 'Nuclear', label: 'Nuclear' },
];
export const bankOp = [
    { value: 'Bank', label: 'Bank' },
    { value: 'Micro-Finance', label: 'Micro-Finance' },
    { value: 'Co-Operative', label: 'Co-Operative' },
];
export const relationOp = [
    { value: 'Son', label: 'Son' },
    { value: 'Daughter', label: 'Daughter' },
    { value: 'Husband', label: 'Husband' },
    { value: 'Father', label: 'Father' },
    { value: 'Mother', label: 'Mother' },
    { value: 'Brother', label: 'Brother' },
    { value: 'Sister', label: 'Sister' },
];
export const maritalOp = [
    { value: 'Single', label: 'Single' },
    { value: 'Married', label: 'Married' },
    { value: 'Divorced', label: 'Divorced' },
    { value: 'Widowed', label: 'Widowed' },
    { value: 'Widow', label: 'Widow' },
];
export const religionOp = [
    { value: 'Islam', label: 'Islam' },
    { value: 'Christian', label: 'Christian' },
    { value: 'Hindu', label: 'Hindu' },
    { value: 'Buddhist', label: 'Buddhist' },
    { value: 'Others', label: 'Others' },
];
export const idTypeOp = [
    { value: 'NRC', label: 'NRC' },
    { value: 'Passport', label: 'Passport' },
    { value: 'Lisense', label: 'Lisense' },
];

export const countryOp = [
    { value: 'ZM', label: 'Zambia' },
    { value: 'TR', label: 'Turkey' },
    { value: 'EG', label: 'Egypt' },
    { value: 'KE', label: 'Kenya' },
    { value: 'ET', label: 'Ethiopia' },
    { value: 'GH', label: 'Ghana' },
    { value: 'MA', label: 'Morocco' },
    { value: 'TN', label: 'Tunisia' },
    { value: 'TZ', label: 'Tanzania' },
    { value: 'DZ', label: 'Algeria' },
    { value: 'UG', label: 'Uganda' },
    { value: 'ZW', label: 'Zimbabwe' },
    { value: 'CM', label: 'Cameroon' },
    { value: 'MZ', label: 'Mozambique' },
    { value: 'AO', label: 'Angola' },
    { value: 'CI', label: 'Ivory Coast' },
    { value: 'CD', label: 'DR Congo' },
    { value: 'SN', label: 'Senegal' },
    { value: 'ML', label: 'Mali' },
    { value: 'BW', label: 'Botswana' },
    { value: 'NA', label: 'Namibia' },
    { value: 'BF', label: 'Burkina Faso' },
    { value: 'MW', label: 'Malawi' },
    { value: 'SO', label: 'Somalia' },
    { value: 'LY', label: 'Libya' },
    { value: 'MU', label: 'Mauritius' },
    { value: 'MG', label: 'Madagascar' },
    { value: 'RW', label: 'Rwanda' },
    { value: 'SC', label: 'Seychelles' },
    { value: 'CV', label: 'Cape Verde' },
    { value: 'ER', label: 'Eritrea' },
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'AU', label: 'Australia' },
    { value: 'IN', label: 'India' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'CN', label: 'China' },
    { value: 'JP', label: 'Japan' },
    { value: 'BR', label: 'Brazil' },
    { value: 'ZA', label: 'South Africa' },
    { value: 'NG', label: 'Nigeria' },
    { value: 'MX', label: 'Mexico' },
    { value: 'IT', label: 'Italy' },
    { value: 'ES', label: 'Spain' },
    { value: 'RU', label: 'Russia' },
    { value: 'KR', label: 'South Korea' },
    { value: 'SE', label: 'Sweden' },
    { value: 'NL', label: 'Netherlands' }
];
export const maskConfig = {
    'phone_number': {
        mask: [
            '+',
            '2', '6', '0', // Allow up to three digits for the country code
            ' ',
            /\d/, /\d/, /\d/, // First group of three digits
            ' ',
            /\d/, /\d/, /\d/, // Second group of three digits
            ' ',
            /\d/, /\d/, /\d/  // Third group of three digits
        ],
        placeholder: '+260 ___ ___ ___'
    },
    'NRC': {
        mask: [
            /\d/, /\d/, /\d/, /\d/, /\d/, /\d/,
            '/',
            /\d/, /\d/, // First group of three digits
            '/',
            /\d/
        ],
        placeholder: '______/__/_'
    },
    'Lisense': {
        mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
        placeholder: '________'
    },
    'Passport': {
        mask: [/[A-Za-z]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
        placeholder: 'A________'
    },
};


export const getMaskForIdType = (idType: string) => {
    switch (idType) {
        case 'NRC':
            return { mask: maskConfig.NRC.mask, placeholder: maskConfig.NRC.placeholder };
        case 'Passport':
            return { mask: maskConfig.Passport.mask, placeholder: maskConfig.Passport.placeholder };;
        case 'Lisense':
            return { mask: maskConfig.Lisense.mask, placeholder: maskConfig.Lisense.placeholder };
        default:
            return { mask: [], placeholder: '' };
    }
};