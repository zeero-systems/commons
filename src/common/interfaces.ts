import type { ArtifactType, JsonType, KeyType, MetaTagType } from '~/common/types.ts';

/**
 * Extended errors with known keys
 *
 * @interface ExceptionInterface<K>
 *
 * @member {K | 'EXCEPTION'} key - Custom allowed keys
 * @member {string} name - Exeption name
 * @member {string} message - Exeption message
 * @member {JsonType} context - Metadata about the exception
 * @member {string | undefined} stack - Execution stack
 */
export interface ExceptionInterface<K> extends Error {
  key?: K | 'EXCEPTION';
  name: string;
  message: string;
  context?: JsonType;
  stack?: string | undefined;
}

/**
 * Extended error options with context
 *
 * @interface ExceptionOptionsInterface
 *
 * @member {JsonType} context - Metadata about the exception
 */
export interface ExceptionOptionsInterface extends ErrorOptions {
  context?: JsonType;
}

/**
 * Extended exceptions options with key
 *
 * @interface KeyableExceptionOptionsInterface
 *
 * @member {K} key - Custom allowed keys
 */
export interface KeyableExceptionOptionsInterface<K> extends ExceptionOptionsInterface {
  key?: K;
}

/**
 * Container class to holds artifacts and metadata
 *
 * @interface ArtifactorInterface
 *
 * @member {Map<MetaTagType, Map<KeyType, ArtifactType>>} artifacts - Container for artifacts
 * @method hasTag - Check if a tag exists
 * @method hasKey - Check if a key exists
 * @method has - Alias for hasKey
 * @method set - Set an artifact with associated tags and key
 * @method get - Get an artifact by tag and key
 * @method getByKey - Get an artifact by key across all tags
 * @method getByTag - Get all artifacts associated with a tag
 */
export interface ArtifactorInterface {
  hasTag(tag: MetaTagType): boolean
  hasKey(key: KeyType): boolean
  has(tag: KeyType, key: KeyType): boolean
  set(tags: MetaTagType | Array<MetaTagType>, key: KeyType, artifact: ArtifactType): ArtifactType
  get(tag: MetaTagType, key: KeyType): ArtifactType | undefined
  getByKey(key: KeyType): ArtifactType | undefined
  getByTag(tag: MetaTagType): Map<KeyType, ArtifactType> | undefined
  size(): number
  sizeByTag(tag: MetaTagType): number
}

export default {};
