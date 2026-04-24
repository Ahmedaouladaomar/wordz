import type { EntitySubscriberInterface, InsertEvent, UpdateEvent } from 'typeorm';
import { EventSubscriber } from 'typeorm';

import { generateHash } from '../../common/utils/hash-generator';
import { User } from '../../modules/user/entities/user.entity';
import { Injectable } from '@nestjs/common';

@EventSubscriber()
@Injectable()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo(): typeof User {
    return User;
  }

  beforeInsert(event: InsertEvent<User>): void {
    console.log('Subscriber triggered!');
    if (event.entity.password) {
      event.entity.password = generateHash(event.entity.password);
    }
  }

  beforeUpdate(event: UpdateEvent<User>): void {
    const entity = event.entity as User;

    if (entity.password !== event.databaseEntity.password) {
      entity.password = generateHash(entity.password);
    }
  }
}
