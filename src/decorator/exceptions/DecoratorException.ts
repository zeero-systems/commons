import Exception from '~/common/services/Exception.ts';

export class DecoratorException extends Exception<'NOT_IMPLEMENTED' | 'EXCEPTION'> {}

export default DecoratorException;
