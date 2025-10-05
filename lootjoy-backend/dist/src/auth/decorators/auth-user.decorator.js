"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUser = void 0;
const common_1 = require("@nestjs/common");
exports.AuthUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user)
        return null;
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
});
//# sourceMappingURL=auth-user.decorator.js.map