import AccountService from '../services/account.service';
import ResponseGenerator from '../utils/ResponseGenerator';

const response = new ResponseGenerator();

/**
 * account controller performs account related function - CRUD
 */
class AccountController {
  /**
   * @param{object}  request express request object
   * @param{object}  response express request object
   * @returns {json} json
   * @memberof AccountController
   */
  static createBankAccount(req, res) {
    AccountService.createAccount(req.body, req.payload)
      .then((resp) => response.sendSuccess(res, 201, resp, 'Account Created'))
      .catch((err) => response.sendError(res, err.status, err.message));
  }

  /**
   * @param{object}  request express request object
   * @param{object}  response express request object
   * @returns {json} json
   * @memberof AccountController
   */
  static fetchAllAccounts(req, res) {
    AccountService.getAllAccounts(req.query)
      .then((resp) => response.sendSuccess(res, 200, resp, 'Account fetch successfull'))
      .catch((err) => response.sendError(res, err.status, err.message));
  }

  /**
   * @param{object}  request express request object
   * @param{object}  response express request object
   * @returns {json} json
   * @memberof AccountController
   */
  static getAUserAccounts(req, res) {
    AccountService.getAUserAccounts(req.payload)
      .then((resp) => response.sendSuccess(res, 200, resp, 'Account fetch successfull'))
      .catch((err) => response.sendError(res, err.status, err.message));
  }

  /**
   * @param{object}  request express request object
   * @param{object}  response express request object
   * @returns {json} json
   * @memberof AccountController
   */
  static getAccount(req, res) {
    AccountService.getAccount(req.params)
      .then((resp) => response.sendSuccess(res, 200, resp, 'Account fetch successfull'))
      .catch((err) => response.sendError(res, err.status, err.message));
  }
}

export default AccountController;