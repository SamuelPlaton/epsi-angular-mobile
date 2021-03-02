interface Services {
    id: String;

    attributes: {
        description: String;
        creationDate: String;
        state: String;
        sector: String;
        exchangeType: String;
    };

    relationships: {
        applicant: string;
        worker?: string;
    };
}