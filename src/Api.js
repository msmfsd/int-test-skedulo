import 'whatwg-fetch'

// API server
const API_URL = 'http://localhost:3000'
// headers
const opts = {
  method: 'get',
  headers: { 'Content-type': 'application/json' }
}

/**
* @class Api
*/
export default class Api {

  /**
   * Get people
   * @return {object} promise
   */
  static GetPeopleData () {
    return fetch(API_URL + '/people', opts)
        .then(response => {
          return response.json()
        })
  }

  /**
   * Get people skills
   * @param {string} ids
   * @return {object} promise
   */
  static GetPeopleSkills (ids) {
    return fetch(API_URL + '/skills/' + ids, opts)
        .then(response => {
          return response.json()
        })
  }

  /**
   * Get people interests
   * @param {string} ids
   * @return {object} promise
   */
  static GetPeopleInterests (ids) {
    return fetch(API_URL + '/interests/' + ids, opts)
        .then(response => {
          return response.json()
        })
  }

}
