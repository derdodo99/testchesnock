"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateParams = exports.RevealDto = exports.CommitDto = exports.CreatePrivateDto = exports.QueueDto = void 0;
class QueueDto {
    bet;
}
exports.QueueDto = QueueDto;
class CreatePrivateDto {
    bet;
    opponentId;
}
exports.CreatePrivateDto = CreatePrivateDto;
class CommitDto {
    gameId;
    commitHash;
}
exports.CommitDto = CommitDto;
class RevealDto {
    gameId;
    symbol;
    nonce;
}
exports.RevealDto = RevealDto;
class StateParams {
    gameId;
}
exports.StateParams = StateParams;
//# sourceMappingURL=index.js.map