import { entityToSchema } from '../../../core/infrastructure/http/swagger/entityToSchema';
import { AddDepositWalletAction } from '../../application/AddDepositWallet';
import { Currency } from '../../../core/Currency';
import { WithdrawWalletAction } from '../../application/WithdrawWallet';

export function addDepositSchema() {
    const { userId, ...schema } = entityToSchema(new AddDepositWalletAction(
        'user-123',
        new Currency(1),
    )) as Record<string, unknown>;

    return schema as object;
}

export function withdrawSchema() {
    const { userId, ...schema } = entityToSchema(new WithdrawWalletAction(
        'user-123',
        new Currency(1),
    )) as Record<string, unknown>;

    return schema as object;
}