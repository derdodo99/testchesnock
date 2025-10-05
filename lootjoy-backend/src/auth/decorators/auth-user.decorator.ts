import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const AuthUser = createParamDecorator(
  (data: keyof any | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user) return null;

    if (data) {
      const value = user[data];
      if (data === "id" && typeof value === "string") {
        return Number(value);
      }
      return value;
    }

    if (user.id && typeof user.id === "string") {
      user.id = Number(user.id);
    }
    return user;
  },
);
