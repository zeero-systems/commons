import Exception from '~/common/services/Exception.ts';

export class ProviderException extends Exception<'NOT_FOUND' | 'EXCEPTION'> {}

export default ProviderException