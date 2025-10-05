"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BOT_ID = exports.RPS_REASON = void 0;
exports.corr = corr;
exports.RPS_REASON = {
    HOLD: "RPS_HOLD",
    REFUND: "RPS_REFUND",
    WIN: "RPS_WIN",
};
function corr(gameId, tag, userId) {
    return `rps:${gameId}:${tag}:u${userId}`;
}
exports.BOT_ID = 0;
//# sourceMappingURL=index.js.map