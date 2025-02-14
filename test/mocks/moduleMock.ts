import { AnimalNonProviderMock } from '-/test/mocks/providerMocks.ts';

import Module from '~/module/decorations/Module.ts';

@Module()
export class EmptyApp {}

@Module({
  providers: [AnimalNonProviderMock]
})
export class ProviderApp {}