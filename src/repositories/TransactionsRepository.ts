import { EntityRepository, Repository } from 'typeorm';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  fileRows: Transaction[] = [];

  public async getBalance(transactions: Transaction[]): Promise<Balance> {
    let inc = 0;
    let out = 0;

    const valorInicial = 0;
    transactions.reduce(function (acumulador, valorAtual) {
      const { type, value } = valorAtual;

      if (type === 'income') {
        inc += value;
      } else {
        out += value;
      }

      return acumulador + valorAtual.value;
    }, valorInicial);

    const balance = {
      income: inc,
      outcome: out,
      total: Number(inc - out),
    };
    return balance;
  }
}

export default TransactionsRepository;
