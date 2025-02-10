// deno-lint-ignore-file ban-types
import type { EntryType, OmitType } from '~/common/types.ts';
import type { EntityInterface } from '~/entity/interfaces.ts';
import type { ValidationResultType } from '~/validator/types.ts';
import type { ValidationInterface } from '~/validator/interfaces.ts';

import Context from '~/decorator/services/Context.ts';
import ContextTagEnum from '~/decorator/enums/ContextTagEnum.ts';

import guardDateFn from '~/common/guards/guardDateFn.ts';
import getObjectEntriesFn from '~/common/functions/getObjectEntriesFn.ts';
import validateValueFn from '~/validator/functions/validateValueFn.ts';

export class Entity implements EntityInterface {
	public toEntries(): ReadonlyArray<EntryType<OmitType<this, Function>>> {
		return getObjectEntriesFn<OmitType<this, Function>>(this);
	}

	public toPlain(): string {
		return this.toEntries().reduce((a, [key, value]) => {
			return a += `${String(key)}=${value}\n`;
		}, '').trim();
	}

	public toJson(): OmitType<this, Function> {
		return this.toEntries().reduce((a, [key, value]) => {
			return { ...a, [key]: value };
		}, {}) as this;
	}

	public getPropertyKeys<K extends keyof OmitType<this, Function>>(): K[] {
		return Object.getOwnPropertyNames(this) as K[];
	}

	public getPropertyType<K extends keyof OmitType<this, Function>>(propertyKey: K): string {
		if (guardDateFn(this[propertyKey])) {
			return `[object Date]`;
		}

		return `${typeof this[propertyKey]}`;
	}

	public validateProperty<K extends keyof OmitType<this, Function>>(propertyKey: K): ValidationResultType[] {
		const decorator = Context.getDecorator<typeof this, any>(this);
		const decorators = decorator?.get(propertyKey)?.get(ContextTagEnum.VALIDATIONS);

		if (!decorators) return [];

		const validations = decorators.map((decorator) => {
			return { validation: decorator.target as unknown as ValidationInterface, parameters: decorator.parameters };
		});

		return validateValueFn(this[propertyKey], validations);
	}

	public validateProperties(): { [key in keyof OmitType<this, Function>]: ValidationResultType[] } {
		return this.toEntries().reduce((a, [key, value]) => {
			return { ...a, [key]: this.validateProperty(key as any) };
		}, {}) as { [key in keyof OmitType<this, Function>]: ValidationResultType[] };
	}
}

export default Entity;
