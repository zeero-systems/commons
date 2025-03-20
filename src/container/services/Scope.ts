import { DecorationType } from '~/decorator/types.ts';
import ScopeEnum from '~/container/enums/ScopeEnum.ts';
import Metadata from '~/common/services/Metadata.ts';

export class Scope {
  public static readonly metadata: unique symbol = Symbol('Scope.metadata');

  public static applyMetadata<P>(decoration: DecorationType<P>): void {
    if (decoration.property) {
      if (!decoration.context.metadata[Scope.metadata]) {
        decoration.context.metadata[Scope.metadata] = ScopeEnum.Transient;
      }
    }
  }

  public static set<P>(scope: ScopeEnum, decoration: DecorationType<P>): void {
    decoration.context.metadata[Scope.metadata] = scope
  }

  public static get(target: any): ScopeEnum {
    let scope = ScopeEnum.Transient;
    const metadata = Metadata.get(target);
    if (metadata) {
      scope = metadata[Scope.metadata];
    }

    return scope;
  }
}

export default Scope;
