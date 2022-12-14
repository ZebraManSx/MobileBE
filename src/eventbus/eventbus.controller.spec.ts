import { Test, TestingModule } from '@nestjs/testing';
import { EventbusController } from './eventbus.controller';

describe('EventbusController', () => {
  let controller: EventbusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventbusController],
    }).compile();

    controller = module.get<EventbusController>(EventbusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
