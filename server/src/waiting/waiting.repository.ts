import { EntityRepository, Repository } from 'typeorm';
import { Waiting } from './entities/waiting.entity';

@EntityRepository(Waiting)
export class WaitingRepository extends Repository<Waiting> {}
