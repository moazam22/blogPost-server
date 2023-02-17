import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { SuccessResponse } from "src/utils";

@InputType()
export class CreateUserDto {
  @Field()
  name: string;
  @Field()
  email: string;
  @Field()
  password: string;
}

@InputType()
export class UpdateUserDto {
  @Field()
  name?: string;
  @Field()
  email?: string;
}

@InputType()
export class LoginDto {
  @Field()
  email: string;
  @Field()
  password: string;
}


@ObjectType()
export class LoginSuccessResponse {
  @Field()
  access_token: string;
}


@InputType()
export class ForgotPasswordDto {
  @Field()
  email: string;
}


@ObjectType()
export class resetPasswordKeyDto {
  @Field()
  passwordResetKey: string;
  @Field()
  passResetKeyExpiry: string;
}

@ObjectType()
export class ForgotPasswordResponse extends SuccessResponse {
  @Field()
  resetKey: string;
}

@InputType()
export class ResetPasswordDto {
  @Field()
  email: string;
  @Field()
  password: string;
  @Field()
  resetKey: string;
}
