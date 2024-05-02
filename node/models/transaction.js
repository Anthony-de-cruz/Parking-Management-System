/**
 * Used to represent the transaction logs.
 * When user's balance is updated on the database,
 * a transaction record is automatically generated.
 * At no point should you actually need to create a
 * brand new transaction record,
 * just fetch ones from the database to view.
 */
class Transaction {
  /**
   * @param {number} transaction_id
   * @param {string} transactor_username
   * @param {number} amount - Integer measured in pence
   * @param {Date} timestamp
   */
  constructor(transaction_id, transactor_username, amount, timestamp) {
    this.transaction_id = transaction_id;
    this.transactor_username = transactor_username;
    this.amount = amount;
    this.timestamp = timestamp;
  }
}

module.exports = Transaction;
