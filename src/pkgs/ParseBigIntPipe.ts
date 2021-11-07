import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ParseBigIntPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): BigInt {
    return BigInt(value);
  }
}
