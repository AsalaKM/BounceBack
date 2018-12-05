export const state = {
  surename: '',
  forename: '',
  username: '',
  date_of_birth: '',
  gender: 'Male',
  martial_status: 'Single',
};
export const fields = [
  [
    {
      tag: 'Input',
      label: 'Surname',
      name: 'surename',
      width: '20rem',
      placeholder: 'surname',
    },
    {
      tag: 'Input',
      label: 'Forename',
      name: 'forename',
      width: '20rem',
      placeholder: 'forename',
    },
  ],
  [
    {
      tag: 'Input',
      label: 'username',
      name: 'username',
      width: '20rem',
      placeholder: 'username',
    },
    {
      tag: 'Input',
      label: 'Day Of Birth',
      name: 'date_of_birth',
      width: '20rem',
      type: 'date',
    },
  ],
  [
    {
      tag: 'DropDown',
      label: 'Gender',
      name: 'gender',
      width: '22rem',
      options: ['Male', 'Female'],
    },
    {
      tag: 'DropDown',
      label: 'Matrial Status ',
      name: 'martial_status',
      width: '22rem',
      options: ['Single', 'Married'],
    },
  ],
  [
    {
      tag: 'Button',
      value: 'Add Worker',
      staticField: true,
      color: '#272727',
    },
    {
      tag: 'Button',
      value: 'Clear Fields',
      staticField: true,
      color: '#FF4800',
    },
  ],
];

export const validationForm = (Fields) => {
  const keys = Object.keys(Fields);
  for (let index = 0; index < keys.length; index += 1) {
    if (Fields[keys[index]] === '') { return `Please check ${keys[index]}`; }
  }
  return null;
};
