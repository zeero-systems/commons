import type { DecorationMetadataMapType, DecorationMetadataType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/Decorator.ts';
import Metadata from '~/common/services/Metadata.ts';

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

  public static has<T extends Record<PropertyKey, any>>(
    target: T,
    annotation: string,
    propertyKey: PropertyKey = 'construct',
  ): boolean {
    const metadata = Metadata.getByKey<DecorationMetadataMapType>(target, Decorator.metadata);

    if (metadata) {
      const decorations = metadata.get(propertyKey);
      if (decorations) {
        return decorations.some((decorator: DecorationMetadataType<any>) => {
          return decorator.annotation.constructor.name == annotation;
        })
      }
    }

    return false;
  }

  public static get<T extends Record<PropertyKey, any>>(
    target: T,
    annotation: string,
    propertyKey: PropertyKey = 'construct',
  ): DecorationMetadataType<Record<KeyType, any>> | undefined {
    const metadata = Metadata.getByKey<DecorationMetadataMapType>(target, Decorator.metadata);

    return metadata && metadata.get(propertyKey)?.find((decorator: DecorationMetadataType<Record<KeyType, any>>) => {
      return decorator.annotation.constructor.name == annotation;
    });
  }
}

export default Decoration;
