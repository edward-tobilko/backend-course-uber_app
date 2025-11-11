import { body } from 'express-validator';

import { ResourceEnum } from '../../types/resources-enum';

export function resourceEnumValidation(resourceType: ResourceEnum) {
  return body('data.type')
    .isString()
    .equals(resourceType)
    .withMessage(`Resource type must be ${resourceType}`);
}
