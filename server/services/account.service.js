import _ from 'lodash';
import {
  User,
  Account
} from '../database/models';


/** service that allows user create bank account, delete bank account */
class AccountService {
  /**
   * @description Create a new user
   * @param {object} a new user object
   */

  static async createAccount({ type }, { id }) {
    try {
      const user = await User.findOne({
        where: {
          id
        }
      }); // check if user already exist
      if (user) {
        const account = await Account.findAll({
          where: {
            owner: id
          },
        });

        if (account.length > 0) {
          if (account.length === 2) {
            const err = new Error(`user already have a savings and current accounts - ${account[0].accountNumber} and ${account[1].accountNumber} `);
            err.status = 409;
            throw err;
          }

          if (account[0].type === type) {
            const err = new Error(`user already have a ${type} account : ${account[0].accountNumber}`);
            err.status = 409;
            throw err;
          }
        }

        // create a new bank account
        const newAccount = await Account.create({
          owner: id,
          type,
        });


        return newAccount;
      }

      const err = new Error('user doesn\'t exist');
      err.status = 400;
      throw err;
    } catch (error) {
      error.status = error.status || 500;
      throw error;
    }
  }

  /**
   * @description it fetches all accounts
   * @param {array} of user objects
   */
  static async getAllAccounts({ status }) {
    // eslint-disable-next-line no-useless-catch
    try {
      let accounts = await Account.findAll({
        include: [{
          model: User,
          as: 'user'
        }]
      });

      accounts = accounts.map((account) => _.pick(account, ['accountNumber', 'type', 'balance', 'status', 'user.firstName', 'user.lastName', 'user.email']));

      if (status) {
        return accounts.filter((account) => account.status === status);
      }
      return accounts;
    } catch (error) {
      error.status = error.status || 500;
      throw error;
    }
  }

  /**
   * @description this function get all account owned by specific user
   * @param {string} email address of a user
   */

  static async getAUserAccounts({ email }) {
    try {
      const user = await User.findOne({ where: { email } });
      if (user) {
        const accounts = await Account.findAll({
          where: { owner: user.id },
          include: [{
            model: User,
            as: 'user'
          }]
        });

        return accounts.map((account) => _.pick(account, ['accountNumber', 'type', 'balance', 'status', 'user.firstName', 'user.lastName', 'user.email']));
      }
      const error = new Error('user with this email address not found');
      error.status = 400;
      throw error;
    } catch (error) {
      error.status = error.status || 500;
      throw error;
    }
  }

  /**
   * @description this function fetches a single user account
   * @param {object} response
   */
  static async getAccount({ accountNumber }) {
    try {
      const foundAccount = await Account.findOne({
        where: { accountNumber },
        include: {
          model: User,
          as: 'user'
        }
      });

      if (foundAccount) {
        return _.pick(foundAccount, ['accountNumber', 'type', 'balance', 'status', 'user.firstName', 'user.lastName', 'user.email']);
      }
      const error = new Error('account number doesn\'t exist');
      error.status = 404;
      throw error;
    } catch (error) {
      error.status = error.status || 500;
      throw error;
    }
  }
}

export default AccountService;