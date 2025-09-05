import { ArtifactType } from '~/common/types.ts';
import isObject from '~/common/guards/is-object.guard.ts';

export const isArtifact = (x: unknown): x is ArtifactType => {
  return isObject(x) && 'name' in x && 'target' in x;
};

export default isArtifact;
