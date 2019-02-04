import { UsersService } from '../users/users.service';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Any } from 'typeorm';
import { Settings } from './settings.entity';
import { SettingsDto } from './dto/settings.dto';
import { Query, InitializedSettings } from './helpers/helpers';
import { User } from 'users/user.entity';

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

  async initializeUserSettings( user: User ): Promise<boolean> {
    const initializedSettings: InitializedSettings = new InitializedSettings( user, true, true, true, true );
    const results = await this.settingsRepository.save( initializedSettings );

    return results ? true : false;
  }
}