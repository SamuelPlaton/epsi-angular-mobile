interface Services {
    id: string;

    attributes: {
        title: string;
        description: string;
        localization: string;
        creationDate: string;
        state: string;
        exchangeType: string;
    };

    relationships: {
        applicant: string;
        worker?: string;
        secteur: string;
    };
}