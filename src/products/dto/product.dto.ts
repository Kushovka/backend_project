import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: string;

  @ApiProperty()
  stock: number;

  @ApiProperty({ nullable: true })
  category?: string;
}
