import { AppException } from './app.exception';
import { HttpStatus } from '@nestjs/common';

export class EntityNotFoundException extends AppException {
  constructor(entityName: string, id: string) {
    super(
      `${entityName} not found with ID: ${id}`,
      'ENTITY_NOT_FOUND',
      HttpStatus.NOT_FOUND,
      { entity: entityName, id },
    );
  }
}