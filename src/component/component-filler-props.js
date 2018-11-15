import globals from '../globals';
import registrar from '../compiler/registrar';
import queryToProps from '../component/query-to-props';
import get from 'lodash/get';

export class Getter {
  constructor({ action, component, args, globals }) {
    this._action = action;
    this._component = component;
    this._args = args;
    this._globals = globals;
  }

  get(name) {
    const names = name.split('.');
    const firstName = names[0];
    switch (firstName) {
      case 'action':
        return this._action ? this._action.get(name) : undefined;

      case 'arguments':
        if (names.length > 1) {
          names.shift(); // remove first name
          return this._args ? get(this._args, names.join('.')) : undefined;
        } else {
          return this._args;
        }

      case 'globals':
        names.shift(); // remove first name
        return this._globals ? get(this._globals, names.join('.')) : undefined;

      default:
        return this._component ? this._component.get(name) : undefined;
    }
  }
}

export default class ComponentFillerProps {
  constructor() {
    // For mocking
    this._registrar = registrar;
  }

  _getSession() {
    const reg = this._registrar;
    return reg.client ? reg.client.user.getSession() : undefined;
  }

  // TODO: refactor so that we just expose the globals component and a session property. This wasy,
  // we don't process the properties until they are needed. The session property can probably be on
  // globals and simply return a session when it is retrieved, e.g. see FormEditor and the
  // definition property for a similar example.
  _getGlobals() {
    return {
      session: this._getSession(),
      ...globals.get()
    };
  }

  _formToFillerProps(component) {
    const fields = {};
    component.eachField(field => (fields[field.get('name')] = field.get()));
    return fields;
  }

  getFillerProps(props) {
    // Wrap in a Getter so that we expose a single get() to PropFiller
    return new Getter({
      action: props && props.parent,
      component: props && props.component,
      args: props && props.arguments,
      globals: this._getGlobals()
    });
  }

  getWhereProps(where, props) {
    // Wrap in a Getter so that we expose a single get() to queryToProps()
    const component = new Getter({
      action: props.parent,
      component: props.component,
      args: props.arguments,
      globals: this._getGlobals()
    });

    return queryToProps(where, component);
  }
}
