import { UsersService } from '../users/users.service';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Any } from 'typeorm';
import { Settings } from './settings.entity';
import { SettingsDto } from './dto/settings.dto';
import { Query } from './helpers/helpers';

@Injectable()
export class SettingsService {

  constructor(@InjectRepository(Settings)
  private readonly settingsRepository: Repository<Settings>,
  ){}

  async getUserSettings( userId: number ): Promise<Settings> {
    const query: Query = new Query( userId );

    return await this.settingsRepository.findOne( query );
  }

  async updateUserSettings( settingsDto: SettingsDto ): Promise<void> {
    await this.settingsRepository.save( settingsDto );
  }
}