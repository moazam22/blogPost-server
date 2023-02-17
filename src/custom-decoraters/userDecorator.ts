import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const LogedInUser = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const { user } = GqlExecutionContext.create(ctx).getContext();
    return user;
  },
);
