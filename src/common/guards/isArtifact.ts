import { ArtifactType } from '~/common/types.ts';
import isObject from './isObject.ts';

export const isArtifact = (x: unknown): x is ArtifactType => {
  return isObject(x) && 'name' in x && 'target' in x;
};

export default isArtifact;
