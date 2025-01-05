import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  ParseUUIDPipe,
  Query,
  Patch,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ORDER_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { OrderPaginationDto, StatusDto } from './dto';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly ordersService: ClientProxy,
  ) {}

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.send({ cmd: 'create_order' }, createOrderDto);
  }

  @Get()
  findAllOrders(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.ordersService.send({ cmd: 'find_orders' }, orderPaginationDto);
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(
        this.ordersService.send({ cmd: 'find_order' }, { id }),
      );

      return order;
    } catch (error) {
      console.log(123);

      throw new RpcException(error);
    }
  }

  @Get(':status')
  async findOrdersByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    try {
      return this.ordersService.send(
        { cmd: 'find_orders' },
        { ...paginationDto, status: statusDto.status },
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  async changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    try {
      return this.ordersService.send(
        { cmd: 'change_order_status' },
        { id, status: statusDto.status },
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
