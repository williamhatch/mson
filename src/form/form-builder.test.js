import FormBuilder from './form-builder';

// Note: this is needed so that FieldEditorForm has a reference to the compiler
import '../compiler';

it('should set via mson', () => {
  const builder = new FormBuilder();

  builder.set({
    mson: {
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
    }
  });

  expect(builder.get('fields.form.form.value')).toEqual({
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
  });
});
