import type { EntityInterface } from '~/entity/interfaces.ts';

export function isEntity(value: unknown): value is EntityInterface {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const entity = value as any;
  
  return (
    typeof entity.validateProperty === 'function' &&
    typeof entity.validateProperties === 'function' &&
    typeof entity.getPropertyKeys === 'function'
  );
}

export default isEntity;
