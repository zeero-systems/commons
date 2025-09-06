import type { DecorationMetadataMapType, DecorationMetadataType } from '~/decorator/types.ts';
import type { KeyType } from '~/common/types.ts';

import Decorator from '~/decorator/services/decorator.service.ts';
import Metadata from '~/common/services/metadata.service.ts';
import Text from '~/common/services/text.service.ts';
import isString from '~/common/guards/is-string.guard.ts';
import isArray from '../../common/guards/is-array.guard.ts';

/**
 * Class providing common operations for metadata management related to decorations
 * 
 * @class Decoration
 * @static
 * 
 * @method has - Checks if a target has a specific decoration annotation
 * @method get - Retrieves the decoration metadata for a specific annotation
 * 
 */
export class Decoration {

  public static has(
    target: any,
    propertyKey: PropertyKey,
    annotation?: string,
  ): boolean {

    if (isString(propertyKey) && propertyKey.includes('.')) {
      [propertyKey, annotation] = propertyKey.split('.');
    }

    const name = Text.toFirstLetterUppercase(annotation)
    const metadata = Metadata.getByKey<DecorationMetadataMapType<any>>(target, Decorator.metadata);

    if (metadata) {
      const decorations = metadata.get(propertyKey);
      if (decorations) {
        return decorations.some((decorator: DecorationMetadataType<any>) => {
          return Text.toFirstLetterUppercase(decorator.annotation.constructor.name) == name;
        })
      }
    }

    return false;
  }

  public static get<T extends Record<PropertyKey, any>>(
    target: T,
    propertyKey: PropertyKey,
    annotation?: string,
  ): DecorationMetadataType<Record<KeyType, any>> | undefined {
    
    if (isString(propertyKey) && propertyKey.includes('.')) {
      [propertyKey, annotation] = propertyKey.split('.');
    }

    const name = Text.toFirstLetterUppercase(annotation)
    const metadata = Metadata.getByKey<DecorationMetadataMapType<any>>(target, Decorator.metadata);

    if (metadata) {
      const decorations = metadata.get(propertyKey);
      if (decorations) {
        return decorations.find((decorator: DecorationMetadataType<any>) => {
          return Text.toFirstLetterUppercase(decorator.annotation.constructor.name) == name;
        })
      }
    }
  }
  
  public static list<T extends Record<PropertyKey, any>>(
    target: T,
    propertyKey: PropertyKey | Array<string>
  ): Array<DecorationMetadataType<Record<KeyType, any>>> {
    const metadata = Metadata.getByKey<DecorationMetadataMapType<any>>(target, Decorator.metadata);
    
    if (metadata) {
      if (isArray(propertyKey)) {
        const list = []
        for (const [_key, decorations] of metadata) {
            list.push(...decorations.filter((decorator: DecorationMetadataType<any>) => {
              return propertyKey.some((annotation) => {
                const name = Text.toFirstLetterUppercase(annotation)
                return Text.toFirstLetterUppercase(decorator.annotation.constructor.name) == name;
              })
            })
          )
        }

        return list
      } else {
        return metadata.get(propertyKey) || [];
      }
    }
    
    return [];
  }
}

export default Decoration;
