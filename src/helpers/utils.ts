import { TransformFnParams } from 'class-transformer';
import { OptionalNumberType } from 'src/common/common.type';
import { OptionalPagination } from 'src/common/dto';

export const getPaginationQuery = (page: number, take: number) => {
  if (page && take) {
    const skip = (page - 1) * take;
    return {
      skip,
      take,
    };
  }
  return {};
};

export const generateTakeSkip = (
  pagination: OptionalPagination | undefined = undefined,
) => {
  let skip: OptionalNumberType = undefined;
  let take: OptionalNumberType = undefined;

  if (
    typeof pagination?.page === 'number' &&
    typeof pagination?.take === 'number'
  ) {
    take = pagination.take;
    const page = pagination.page;

    skip = (Number(page) - 1) * Number(take);
  }
  return { take, skip };
};

export function transformToNum(item: TransformFnParams) {
  return item.value ? +item.value : 0;
}
