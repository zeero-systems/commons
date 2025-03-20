import Exception from '~/common/services/Exception.ts';

export class RegisterException extends Exception<'NOT_FOUND' | 'EXCEPTION'> {}

export default RegisterException