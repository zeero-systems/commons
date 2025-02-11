import type { ValidationInterface } from '~/validator/interfaces.ts';

import Singleton from '~/common/decorations/Singleton.ts';
import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

import guardNullFn from '~/common/guards/guardNullFn.ts';
import guardUndefinedFn from '~/common/guards/guardUndefinedFn.ts';

@Singleton()
export class Required implements ValidationInterface {
  guards = [
    guardNullFn,
    guardUndefinedFn,
  ];

  onValidation(record: string | number | null | undefined, _parameters: {}): ValidationEnum {
    if (!guardNullFn(record) && !guardUndefinedFn(record)) {
      return ValidationEnum.VALID;
    }

    return ValidationEnum.INVALID;
  }
}

export default Required;
