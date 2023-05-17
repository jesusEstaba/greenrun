import { Request, ResponseObject, ResponseToolkit } from 'hapi';
import { GetWalletBalance, GetWalletBalanceAction } from '../../../application/GetWalletBalance';
import { AddDepositWallet, AddDepositWalletAction } from '../../../application/AddDepositWallet';
import { WithdrawWallet, WithdrawWalletAction } from '../../../application/WithdrawWallet';
import { TransactionRepository } from '../../../domain/TransactionRepository';
import { TransactionRepositoryImplementation } from '../../storage/TransactionRepositoryImplementation';
import { Currency } from '../../../../core/Currency';

export class WalletHandler {
    private readonly transactionRepository: TransactionRepository;

    private balance: GetWalletBalance;
    private withdraw: WithdrawWallet;
    private deposit: AddDepositWallet;

    constructor() {
        this.transactionRepository = new TransactionRepositoryImplementation();
        this.balance = new GetWalletBalance(
            this.transactionRepository,
        );
        this.withdraw = new WithdrawWallet(
            this.transactionRepository,
        );
        this.deposit = new AddDepositWallet(
            this.transactionRepository,
        );
    }

    async handleBalance(r: Request, h: ResponseToolkit): Promise<ResponseObject> {
        // TODO: remove when auth is implemented
        const action = { userId: '1' } as GetWalletBalanceAction;

        const result = await this.balance.execute(action);
        return h.response(result).code(200);
    }

    async handleDeposit(r: Request, h: ResponseToolkit): Promise<ResponseObject> {
        const action = r.payload as AddDepositWalletAction;

        const { amount } = r.payload as { amount: number };
        action.amount = new Currency(amount);

        // TODO: remove when auth is implemented
        action.userId = '1';

        const result = await this.deposit.execute(action);
        return h.response(result).code(200);
    }

    async handleWithdraw(r: Request, h: ResponseToolkit): Promise<ResponseObject> {
        const action = r.payload as WithdrawWalletAction;

        const { amount } = r.payload as { amount: number };
        action.amount = new Currency(amount);

        // TODO: remove when auth is implemented
        action.userId = '1';

        const result = await this.withdraw.execute(action);
        return h.response(result).code(200);
    }
}