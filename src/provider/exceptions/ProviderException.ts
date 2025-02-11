import Exception from 'packages/common/Exception.ts';

export class ProviderException extends Exception<'NOT_FOUND' | 'EXCEPTION'> {}

export default ProviderException