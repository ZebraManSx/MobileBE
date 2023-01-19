import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MdmService } from './mdm.service';

@Module({
  imports: [HttpModule],
  providers: [MdmService]
})
export class MdmModule {}
