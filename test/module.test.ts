
import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';
import { EmptyApp, ProviderApp } from '-/test/mocks/moduleMock.ts';
import Metadata from '~/decorator/services/Metadata.ts';
import MetadataTagEnum from '~/common/enums/MetadataTagEnum.ts';
import Provider from '~/provider/services/Provider.ts';

describe('module', () => {
  it('add empty module', () => {
    const appModule = new EmptyApp()

    expect(Metadata.getTags(appModule)?.includes(MetadataTagEnum.MODULE))
  });

  it('apply providers', () => {
    new ProviderApp()
    expect(Provider.providers.get("AnimalNonProviderMock")).not.toBeUndefined()
  })
});
