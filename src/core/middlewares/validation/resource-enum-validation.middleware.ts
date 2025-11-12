import { body } from 'express-validator';

import { Resources } from '../../types/resources-enum';

export function resourceEnumValidation(resourceType: Resources) {
  return body('data.type')
    .isString()
    .equals(resourceType)
    .withMessage(`Resource type must be ${resourceType}`);
}
