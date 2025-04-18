import * as Yup from 'yup';

export const phoneSchema = Yup.string()
  .matches(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, 'Некорректный формат телефона')
  .required('Поле обязательно к заполнению');

export const birthdaySchema = Yup.string()
  .matches(/^\d{2}\.\d{2}\.\d{4}$/, 'Введите дату в формате ДД.ММ.ГГГГ')
  .test('valid-date', 'Некорректная дата', (value) => {
    if (!value) return false;
    const [day, month, year] = value.split('.').map(Number);
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day &&
      date < new Date()
    );
  })
  .required('Поле обязательно к заполнению');

export const agreementSchema = Yup.boolean()
  .oneOf([true], 'Необходимо принять соглашение')
  .required('Необходимо принять соглашение');

export const ceidSchema = Yup.string()
  .matches(/^\d+$/, 'ID должно быть числом')
  .min(5, 'ID должен содержать минимум 5 цифр')
  .required('Поле обязательно к заполнению');

// authbyid
export const authByIdSchema = Yup.object({
  ceid: ceidSchema,
  birthday: birthdaySchema,
  phone: phoneSchema,
  isAgreementAccepted: agreementSchema,
});

// authbypersonal
export const authByPersonalSchema = Yup.object({
  surname: Yup.string()
    .min(2, 'Фамилия должна содержать минимум 2 символа')
    .required('Поле обязательно к заполнению'),
  name: Yup.string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .required('Поле обязательно к заполнению'),
  patronymic: Yup.string()
    .min(2, 'Отчество должно содержать минимум 2 символа')
    .required('Поле обязательно к заполнению'),
  birthday: birthdaySchema,
  phone: phoneSchema,
  isAgreementAccepted: agreementSchema,
});

// paydebtform
export const payDebtSchema = Yup.object({
  ceid: ceidSchema,
  sum: Yup.number()
    .typeError('Сумма должна быть числом')
    .positive('Сумма должна быть положительной')
    .required('Сумма платежа обязательна'),
});
