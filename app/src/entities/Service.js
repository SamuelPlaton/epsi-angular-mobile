export const ExchangeTypeEnum = {
    coins: 'coins',
    both: 'both',
    mutual: 'mutual',
  };

export const State = {
    preparation: 'preparation',
    inService: 'in service',
    served: 'served',
    canceled: 'canceled',
  };

export interface Service {
    id: string;

    attributes: {
        title: string;
        description?: string;
        localization: string;
        creationDate: string;
        state: State;
        exchangeType: ExchangeTypeEnum;
    };

    relationships: {
        applicant: string;
        worker?: string;
        sector: string;
    };
    
};