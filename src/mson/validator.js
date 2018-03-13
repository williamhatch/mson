import _ from 'lodash';
import sift from 'sift';

export default class Validator {
  constructor(props) {
    this._props = props;
  }

  _getTemplateName(str) {
    let matches = str.match(/^{{([^{]*)}}$/);
    if (matches) {
      return matches[1];
    }
  }

  _getProp(name) {
    let names = name.split('.');
    if (names.length === 1) {
      return this._props[name];
    } else {
      let value = this._props[names[0]];
      for (let i = 1; i < names.length; i++) {
        value = value[names[i]];
      }
      return value;
    }
  }

  _fillProps(str) {
    // Is the string just a template string?
    let name = this._getTemplateName(str);
    if (name !== undefined) {
      // Replace with the raw prop so that numbers are not converted to strings by replace()
      return this._getProp(name);
    } else {
      return str.replace(/{{([^{]*)}}/g, (match, name) => {
        return this._getProp(name);
      });
    }
  }

  // Performs in place fill to prepare for sift query
  _fillSelector(selector) {
    _.each(selector, (node, name) => {
      // Leaf node?
      if (typeof node === 'string') {
        selector[name] = this._fillProps(node);
      } else {
        // Recursively process node
        this._fillSelector(node);
      }
    });
  }

  _fillErrorProps(error) {
    if (typeof error === 'string') {
      return this._fillProps(error);
    } else {
      error.error = this._fillProps(error.error);
      return error;
    }
  }

  _validateWithRule(rule) {
    // Clone selector as we will be modifying the leaf nodes
    let selector = _.cloneDeep(rule.selector);

    // Fill the props
    this._fillSelector(selector);

    // Validation failed?
    let sifted = sift(selector, [this._props]);
    if (sifted.length > 0) {
      return this._fillErrorProps(rule.error);
    }
  }

  validate(rules, all) {
    let errors = [];

    for (let i = 0; i < rules.length; i++) {
      let error = this._validateWithRule(rules[i]);
      if (error !== undefined) {
        errors.push(error);

        // Do we only want the first error?
        if (!all) {
          break;
        }
      }
    }

    return errors;
  }
}
