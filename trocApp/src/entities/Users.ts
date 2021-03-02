interface Users {
    id: string;

    attributes: {
        firstName: string;
        lastName: string;
        gender: string;
        email: string;
        token: string;
        registerDate: string;
        birthDate: string;
        phone?: number;
        profilePicture?: string;
    };

    relationships: {
        listUsers: Array<string>;
    };
}