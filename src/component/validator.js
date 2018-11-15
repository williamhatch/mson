import each from 'lodash/each';
import cloneDeep from 'lodash/cloneDeep';
import sift from 'sift';
import PropFiller from '../compiler/prop-filler';

export default class Validator {
  constructor(props) {
    this._props = props;
    this._propFiller = new PropFiller(props);
  }

  _fillProps(str) {
    return this._propFiller.fillString(str);
  }

  // Performs in place fill to prepare for sift query
  _fillWhere(where) {
    each(where, (node, name) => {
      // Leaf node?
      if (typeof node === 'string') {
        where[name] = this._fillProps(node);
      } else {
        // Recursively process node
        this._fillWhere(node);
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
    // Clone where as we will be modifying the leaf nodes
    let where = cloneDeep(rule.where);

    // Fill the props
    this._fillWhere(where);

    // Validation failed?
    let sifted = sift(where, [this._props]);
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
