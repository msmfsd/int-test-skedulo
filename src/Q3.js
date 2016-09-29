import Api from './Api'

/**
* @class Q3
*/
export default class Q3 {

  constructor () {
    // vars
    this.people = null
    this.ids = null
    this.skills = null
    this.interests = null
    this.goBtn = document.getElementById('q3-go')
    this.preloader = document.getElementById('preloader')
    this.table = document.getElementById('table')
    this.result = document.getElementById('result')
    this.statusPanel = document.getElementById('status-panel')
    this.status = document.getElementById('status')

    // init
    this.init()

  }

  init () {
    // ensure all CDN libs are defined
    if(typeof $ === 'undefined' || typeof hljs === 'undefined' || typeof Materialize === 'undefined') {
      console.log('Error: CDN lib/s not loaded')
      throw new Error('CDN lib/s not loaded')
    }

    // highlight code snippet
    hljs.initHighlightingOnLoad()

    // event listeners
    this.goBtn.addEventListener('click', (event) => {
      event.preventDefault()
      this.goBtn.disabled = true
      // show preloader
      this.preloader.classList.remove('hide')
      // simulate server latency - NOTE: remove for production eg. if(process.env === 'production')
      let t = setTimeout(() => { this.loadPeopleData() }, 750)
    }, false)

  }

  loadPeopleData () {
    Api.GetPeopleData()
        .then(response => {
            if(!response.success) {
              this.showStatusError('API error: ' + response.message)
            } else {
              // success
              this.people = response.data
              this.ids = this.people.map((obj) => obj.id).join(',')
              this.loadSkills()
            }
          })
          .catch((reason) => {
            this.showStatusError('Server error: ' + reason.message)
          })
  }

  loadSkills () {
    Api.GetPeopleSkills(this.ids)
        .then(response => {
            if(!response.success) {
              this.showStatusError('API error: ' + response.message)
            } else {
              // success
              this.skills = response.data
              this.loadInterests()
            }
          })
          .catch((reason) => {
            this.showStatusError('Server error: ' + reason.message)
          })
  }

  loadInterests () {
    Api.GetPeopleInterests(this.ids)
        .then(response => {
            if(!response.success) {
              this.showStatusError('API error: ' + response.message)
            } else {
              // success
              this.interests = response.data
              this.render()
            }
          })
          .catch((reason) => {
            this.showStatusError('Server error: ' + reason.message)
          })
  }

  render () {
    // immutably combine results
    const data = this.people.map((obj) => {
      let i = this.interests.filter((o) => o.personId === obj.id).map((o) => o.name).join(', ')
      let s = this.skills.filter((o) => o.personId === obj.id).map((o) => o.name).join(', ')
      return { name: obj.name, org: obj.org, skills: s, interests: i }
    })

    // no results?
    if(data.length < 1) {
      html += '<tr><td>No results</td><td></td><td></td><td></td></tr>'
      this.result.innerHTML = html
      return false
    }

    // create html string
    let html = data.map((obj) => {
      return '<tr><td>' + obj.name + '</td><td>' + obj.org + '</td><td>' + obj.skills + '</td><td>' + obj.interests + '</td></tr>'
    }).join(' ')

    // render to table body
    this.result.innerHTML = html

    // update display
    this.preloader.classList.add('hide')
    this.table.classList.remove('hide')

  }

  showStatusError (errMessage) {
    this.status.textContent = 'Error: ' + errMessage
    this.preloader.classList.add('hide')
    this.statusPanel.classList.remove('hide')
  }

}
