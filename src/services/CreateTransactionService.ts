import { getCustomRepository } from 'typeorm';
import { uuid } from 'uuidv4';

import Transaction from '../models/Transaction';
import CreateCategoryService from './CreateCategoryService';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactions = await transactionsRepository.find();
    const balance = await transactionsRepository.getBalance(transactions);

    if (type === 'outcome' && balance && value > balance.total) {
      throw new AppError('Valor extrapolado em conta.');
    }

    const createCategoryService = new CreateCategoryService();
    const categoria = await createCategoryService.execute(category);

    const createTransaction = transactionsRepository.create({
      id: uuid(),
      title,
      type,
      value,
      category_id: categoria.id,
    });
    const transaction = await transactionsRepository.save(createTransaction);
    return transaction;
  }
}

export default CreateTransactionService;
