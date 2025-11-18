import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { WorksService } from './works.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Works')
@Controller('works')
export class WorksController {
  constructor(private readonly worksService: WorksService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Получить все работы' })
  @ApiResponse({ status: 200, description: 'Список работ' })
  findAll() {
    return this.worksService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Получить работу по ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Работа найдена' })
  @ApiResponse({ status: 404, description: 'Работа не найдена' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.worksService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать новую работу (только для админов)' })
  @ApiResponse({ status: 201, description: 'Работа успешно создана' })
  create(@Body() createWorkDto: CreateWorkDto) {
    return this.worksService.create(createWorkDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить работу (только для админов)' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Работа успешно обновлена' })
  @ApiResponse({ status: 404, description: 'Работа не найдена' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWorkDto: UpdateWorkDto,
  ) {
    return this.worksService.update(id, updateWorkDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить работу (только для админов)' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Работа успешно удалена' })
  @ApiResponse({ status: 404, description: 'Работа не найдена' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.worksService.remove(id);
  }
}

