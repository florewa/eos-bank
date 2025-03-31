import * as Yup from 'yup';

const phoneSchema = Yup.string()
  .matches(
    /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
    'Введите корректный номер телефона'
  )
  .required('Телефон обязателен');

// authbyid
export const authByIdSchema = Yup.object({
  id: Yup.number()
    .typeError('ID должно быть числом')
    .integer('ID должно быть целым числом')
    .min(10000, 'ID должен содержать минимум 5 цифр')
    .required('Поле обязательно к заполнению'),
  birthDate: Yup.string()
    .matches(/^\d{2}\.\d{2}\.\d{4}$/, 'Введите дату в формате ДД.ММ.ГГГГ')
    .required('Поле обязательно к заполнению'),
  phone: phoneSchema,
  isAgreementAccepted: Yup.boolean()
    .oneOf([true], 'Необходимо принять соглашение')
    .required('Необходимо принять соглашение'),
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
  birthDate: Yup.string()
    .matches(/^\d{2}\.\d{2}\.\d{4}$/, 'Введите дату в формате ДД.ММ.ГГГГ')
    .required('Поле обязательно к заполнению'),
  phone: phoneSchema,
  isAgreementAccepted: Yup.boolean()
    .oneOf([true], 'Необходимо принять соглашение')
    .required('Необходимо принять соглашение'),
});

// paydebtform
export const payDebtSchema = Yup.object({
  id: Yup.number()
    .typeError('ID должно быть числом')
    .integer('ID должно быть целым числом')
    .min(10000, 'ID должен содержать минимум 5 цифр')
    .required('Поле обязательно к заполнению'),
  sum: Yup.number()
    .typeError('Сумма должна быть числом')
    .positive('Сумма должна быть положительной')
    .required('Сумма платежа обязательна'),
});
