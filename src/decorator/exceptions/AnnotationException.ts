import Exception from '~/common/services/Exception.ts';

export class AnnotationException extends Exception<'NOT_IMPLEMENTED' | 'EXCEPTION'> {}

export default AnnotationException;
