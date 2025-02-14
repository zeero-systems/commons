import Exception from '~/common/services/Exception.ts';

export class ModuleException extends Exception<'NOT_FOUND' | 'EXCEPTION'> {}

export default ModuleException