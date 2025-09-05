import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import Text from '~/common/services/text.service.ts';

describe('text', () => {
  it('toFirstLetterUpercase', () => {
    expect(Text.toFirstLetterUppercase('eduardo')).toEqual('Eduardo');
  });
});
