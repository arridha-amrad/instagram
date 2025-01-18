import { db as db2, DrizzleDatabase, DrizzleTransactionDatabase } from "../db";

abstract class BaseService {
  constructor(
    protected db: DrizzleDatabase | DrizzleTransactionDatabase = db2,
  ) {}
}

export default BaseService;
