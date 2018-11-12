import FormBuilder from './form-builder';

// Note: this is needed so that FieldEditorForm has a reference to the compiler
import '../compiler';

let builder = null;

beforeEach(() => {
  builder = new FormBuilder();
});

const mson = {
  component: 'Form',
  fields: [
    {
      name: 'firstName',
      component: 'TextField',
      label: 'First Name'
    },
    {
      name: 'birthday',
      component: 'DateField',
      label: 'Birthday'
    }
  ]
};

const values = {
  form: {
    fields: [
      {
        name: 'firstName',
        componentName: 'TextField',
        label: 'First Name'
      },
      {
        name: 'birthday',
        componentName: 'DateField',
        label: 'Birthday'
      }
    ]
  }
};

it('should set mson', () => {
  builder.set({ mson });
  expect(builder.getValues()).toEqual(values);
});

it('should get mson', () => {
  expect(builder.get('mson')).toEqual({ component: 'Form', fields: [] });

  builder.setValues(values);
  expect(builder.get('mson')).toEqual(mson);
});
