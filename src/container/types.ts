import type { ArtifactType, KeyableType, PropertyType } from '~/common/types.ts';

import ScopeEnum from '~/container/enums/scope.enum.ts';

export type ConsumerType = ArtifactType & { scope?: ScopeEnum }

export type ProviderType = ArtifactType

export type InjectType = { [key: KeyableType]: Array<{ provider: string, scope: ScopeEnum }> }

export type ProviderParameterType = { name?: string, parameterName?: PropertyType }

export default {};