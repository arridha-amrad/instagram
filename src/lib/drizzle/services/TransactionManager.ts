import { db as db2, DrizzleDatabase, DrizzleTransactionDatabase } from "../db";

type TransactionCallback<T> = (
  transaction: DrizzleTransactionDatabase,
) => Promise<T>;

export class TransactionManager {
  constructor(private db: DrizzleDatabase = db2) {}

  async execute<T>(callback: TransactionCallback<T>): Promise<T> {
    return await this.db.transaction(async (transaction) => {
      try {
        const result = await callback(transaction);
        return result; // Commit happens automatically in Drizzle after callback execution
      } catch (error) {
        throw error; // Rollback happens automatically in Drizzle if an error is thrown
      }
    });
  }
}
