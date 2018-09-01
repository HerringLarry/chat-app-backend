import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('CatsController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
        controllers: [UsersController],
        providers: [UsersService],
      }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersController = module.get<UsersController>(UsersController);
  });

  describe('findAll', () => {
    it('should return a string \'hello\'', async () => {
      const result = 'hello';
      jest.spyOn(usersService, 'findUser').mockImplementation(() => result);

      expect(await usersController.findUser()).toBe(result);
    });
  });
});