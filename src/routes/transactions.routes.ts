import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';

import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

// ✓ should be able to list transactions
// ✓ should be able to create new transaction
// ✓ should create tags when inserting new transactions
// ✓ should not create tags when they already exists
// ✓ should not be able to create outcome transaction without a valid balance
// ✓ should be able to delete a transaction
// ✓ should be able to import transactions

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.find();
  const balance = await transactionsRepository.getBalance(transactions);

  const transaction = {
    transactions,
    balance,
  };

  return response.json(transaction);
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const createTransaction = new CreateTransactionService();
  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });
  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.findOne({
    where: { id },
  });

  if (transactions) {
    const deleted = await transactionsRepository.remove(transactions);
    if (deleted) {
      return response.status(204).json({});
    }
  }
  return null;
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactionService = new ImportTransactionsService();
    const file = request.file.path;

    const transactions = await importTransactionService.execute(file);

    return response.json(transactions);
  },
);

export default transactionsRouter;
