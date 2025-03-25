export interface Promotion {
  title: string;
  contractNumber: string;
  discount: string;
  validity: string;
}

export interface Contract {
  contractNumber: string;
  debtorId: number;
  debtAmount: string;
  bankName: string;
  contractDate: string;
  shares: number;
  remainingDebt: string;
  promotions: Promotion[];
}

export const mockContracts: Contract[] = [
  {
    contractNumber: '12',
    debtorId: 4313,
    debtAmount: '156 256,97 ₽',
    bankName: 'СБЕР',
    contractDate: '12 мая 2025',
    shares: 1234,
    remainingDebt: '123 256,97 ₽',
    promotions: [
      {
        title: 'Летняя скидка',
        contractNumber: '12',
        discount: '10%',
        validity: 'с июня по август',
      },
      {
        title: 'Дополнительный бонус',
        contractNumber: '12',
        discount: '5 000,00 ₽',
        validity: 'с мая по июль',
      },
    ],
  },
  {
    contractNumber: '11',
    debtorId: 4313,
    debtAmount: '156 256,97 ₽',
    bankName: 'СБЕР',
    contractDate: '12 мая 2025',
    shares: 1234,
    remainingDebt: '123 256,97 ₽',
    promotions: [
      {
        title: 'Летняя скидка',
        contractNumber: '12',
        discount: '10%',
        validity: 'с июня по август',
      },
      {
        title: 'Дополнительный бонус',
        contractNumber: '12',
        discount: '5 000,00 ₽',
        validity: 'с мая по июль',
      },
    ],
  },
  {
    contractNumber: '13',
    debtorId: 4314,
    debtAmount: '245 789,45 ₽',
    bankName: 'СБЕР',
    contractDate: '15 июня 2025',
    shares: 567,
    remainingDebt: '200 000,00 ₽',
    promotions: [
      {
        title: 'Сезонное предложение',
        contractNumber: '13',
        discount: '25 000,00 ₽',
        validity: 'с июля по сентябрь',
      },
    ],
  },
  {
    contractNumber: '14',
    debtorId: 4315,
    debtAmount: '89 123,50 ₽',
    bankName: 'СБЕР',
    contractDate: '20 июля 2025',
    shares: 890,
    remainingDebt: '75 000,00 ₽',
    promotions: [],
  },
  {
    contractNumber: '15',
    debtorId: 4316,
    debtAmount: '321 654,78 ₽',
    bankName: 'СБЕР',
    contractDate: '25 августа 2025',
    shares: 432,
    remainingDebt: '300 000,00 ₽',
    promotions: [
      {
        title: 'Осенняя акция',
        contractNumber: '15',
        discount: '15%',
        validity: 'с сентября по ноябрь',
      },
    ],
  },
  {
    contractNumber: '16',
    debtorId: 4317,
    debtAmount: '178 999,99 ₽',
    bankName: 'СБЕР',
    contractDate: '30 сентября 2025',
    shares: 1000,
    remainingDebt: '150 000,00 ₽',
    promotions: [],
  },
];

export default mockContracts;
