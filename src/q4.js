import React, { Component } from 'react'

/**
 * Compare 2 strings
 * @param {string} a
 * @param {string} b
 * @returns {string}
 */
const similar = (a,b) => {
  if(a === b) return '100%'
  const lengthA = a.length
  const lengthB = b.length
  let equivalency = 0
  const minLength = (a.length > b.length) ? b.length : a.length
  const maxLength = (a.length < b.length) ? b.length : a.length
  for(let i = 0; i < minLength; i++) {
    if(a[i] == b[i]) {
      equivalency++
    }
  }
  const weight = equivalency / maxLength
  return Math.round(weight * 100) + "%"
}

/**
* @class SearchBar
*/
class SearchBar extends Component {
  render () {
    return (
      <div className="row">
        <div className="input-field col s12">
          <input placeholder="Start typing.." id="first_name" type="text" onChange={this.props.onQueryChange}/>
          <label htmlFor="first_name">Search Github users</label>
        </div>
      </div>
    )
  }
}

/**
* @class GithubViewer
*/
class GithubViewer extends Component {
  render () {
    return (
      <div>
        <ul className="list-group">
          {
            this.props.data.map( (obj, index) => {
              return (
                <li key={index} className="list-group-item">
                  <a target="_blank" href={obj.html_url}>
                    <div className="card-panel teal lighten-2 z-depth-1">
                      <div className="row valign-wrapper">
                        <div className="col s4">
                          <img width="60" className="circle responsive-img" src={obj.avatar_url} alt={obj.login} />
                        </div>
                        <div className="col s8">
                          <span className="white-text">
                            <h4 className="media-heading">{obj.login}</h4>
                            <p><b>TYPE:</b>{obj.type}</p>
                            <p><small>SCORE: <i>{similar(obj.login, this.props.tags)}</i></small></p>
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                </li>)
            })
          }
        </ul>
      </div>
    )
  }
}

/**
* @class App
*/
export default class App extends Component {

  constructor (props) {
    super(props)
    this.state = {
      data: [],
      loading: false
    }
    this.onChange = this.onChange.bind(this)
  }

  /**
   * On input change
   * @param {object} e
   * @returns {string}
   */
  onChange (e) {
    const that = this
    const val = e.currentTarget.value
    const tags = val.replace(/\s+/g, "+")
    if(val.length < 3) {
      that.setState({ data: [], loading:false })
      return false
    } else {
      that.setState({ loading: true, tags: tags })
    }
    $.getJSON("https://api.github.com/search/users?q=" + tags, (data) => {
      that.setState({ data: data.items, loading:false })
    })

  }

  render () {
    return (
      <div className="well">
        <div className="github-viewer">
          <h2><img className={this.state.loading ? 'logo loading' : 'logo'} width="60" src="https://assets-cdn.github.com/images/modules/logos_page/Octocat.png" /></h2>
          <SearchBar onQueryChange={this.onChange} />
          <GithubViewer data={this.state.data} tags={this.state.tags} />
        </div>
      </div>
    )
  }
}
