interface Users {
    id: String;

    attributes: {
        firstname: String;
        lastname: String;
        gender: String;
        email: String;
        token: String;
        registerDate: String;
        birthDate: String;
        phone: number;
        localization: String;
        profilePicture?: String;
    };

    relationships: {
        listUSers: Array<string>;
    };
}