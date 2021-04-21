import { EntityRepository, Repository } from 'typeorm';
import { Log } from './entities/log.entity';

@EntityRepository(Log)
export class LogRepository extends Repository<Log> {}
