export enum GenderTypeEnum {
    male = 'male',
    female = 'female',
    other = 'other',
  }

interface User {
    id: string;

    attributes: {
        firstName: string;
        lastName: string;
        gender: GenderTypeEnum;
        email: string;
        token: string;
        registerDate: string;
        birthDate: string;
        phone?: number;
        profilePicture?: string;
    };

    relationships: {
        services: Array<string>;
        sectors: Array<string>;
    };
}

export default User;