import Form from './form';
import TextField from './fields/text-field';
import testUtils from './test-utils';

const createForm = () => {
  return new Form({
    fields: [
      new TextField({ name: 'firstName', label: 'First Name', required: true }),
      new TextField({ name: 'middleName', label: 'First Name', required: true }),
      new TextField({ name: 'lastName', label: 'Last Name', required: true })
    ]
  });
};

it('should set, get and clear', () => {
  const form = createForm();

  form.clearValues();
  expect(form.getValues()).toEqual({
    id: null,
    firstName: null,
    middleName: null,
    lastName: null
  });

  form.setValues({
    id: 1,
    firstName: 'Ray',
    lastName: 'Charles'
  });
  expect(form.getValues()).toEqual({
    id: 1,
    firstName: 'Ray',
    middleName: null,
    lastName: 'Charles'
  });

  form.setValues({
    middleName: 'Charles',
    lastName: 'Robinson'
  });
  expect(form.getValues()).toEqual({
    id: 1,
    firstName: 'Ray',
    middleName: 'Charles',
    lastName: 'Robinson'
  });

  form.clearValues();
  expect(form.getValues()).toEqual({
    id: null,
    firstName: null,
    middleName: null,
    lastName: null
  });
});

it('should get null when only set some', () => {
  const form = createForm();

  form.setValues({
    firstName: 'Ray',
    lastName: 'Charles'
  });
  expect(form.getValues()).toEqual({
    id: null,
    firstName: 'Ray',
    middleName: null,
    lastName: 'Charles'
  });
});

it('should clone', () => {
  const form = createForm();

  form.setValues({
    firstName: 'Ray',
    middleName: null,
    lastName: 'Charles'
  });

  const clonedForm = form.clone();

  expect(clonedForm.getValues()).toEqual({
    id: null,
    firstName: 'Ray',
    middleName: null,
    lastName: 'Charles'
  });

  clonedForm.setValues({
    firstName: 'Ray',
    middleName: 'Charles',
    lastName: 'Robinson'
  });

  expect(clonedForm.getValues()).toEqual({
    id: null,
    firstName: 'Ray',
    middleName: 'Charles',
    lastName: 'Robinson'
  });

  expect(form.getValues()).toEqual({
    id: null,
    firstName: 'Ray',
    middleName: null,
    lastName: 'Charles'
  });

  form.validate();
  expect(form.getField('middleName').getErr()).toBeTruthy();

  clonedForm.validate();
  expect(clonedForm.getField('middleName').getErr()).toBeNull();

  form.addField(new TextField({ name: 'suffix', label: 'Suffix', required: true }));
  expect(form._fields.length()).toEqual(5);
  expect(clonedForm._fields.length()).toEqual(4);

  clonedForm.clearValues();
  expect(form.getValues()).toEqual({
    id: null,
    firstName: 'Ray',
    middleName: null,
    lastName: 'Charles',
    suffix: null
  });
});

it('should clone listeners', async () => {
  // Make sure listeners cloned, but separate
  const form = createForm();
  const clonedForm = form.clone();
  const receivedValues = testUtils.once(clonedForm, 'values');
  let receivedNonClonedValues = false;
  form.once('values', () => {
    receivedNonClonedValues = true;
  });
  clonedForm.setValues({
    firstName: 'Raymond'
  });
  await receivedValues;
  expect(receivedNonClonedValues).toEqual(false);
})
