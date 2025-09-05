import Exception from '~/common/services/exception.service.ts';

export class AnnotationException extends Exception<'NOT_IMPLEMENTED' | 'EXCEPTION'> {}

export default AnnotationException;
