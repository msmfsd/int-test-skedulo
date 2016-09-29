// NOTE: see full answer here: http://codepen.io/msmfsd/pen/xELGyZ

/**
 * Compare 2 strings
 * @param {string} a
 * @param {string} b
 * @returns {string}
 */
const similar = (a,b) => {
  if(a === b) return '100%';
  const lengthA = a.length;
  const lengthB = b.length;
  let equivalency = 0;
  const minLength = (a.length > b.length) ? b.length : a.length;
  const maxLength = (a.length < b.length) ? b.length : a.length;
  for(let i = 0; i < minLength; i++) {
    if(a[i] == b[i]) {
      equivalency++;
    }
  }
  const weight = equivalency / maxLength;
  return Math.round(weight * 100) + "%";
}

/**
* @class SearchBar
*/
class SearchBar extends React.Component {
  render() {
    return (
      <div className="form-group">
        <input className="form-control" type="text" placeholder="Start typing.." onChange={this.props.onQueryChange} />
      </div>
    )
  }
}

/**
* @class GithubViewer
*/
class GithubViewer extends React.Component {
  render() {
    return (
      <div>
        <ul className="list-group">
          {
            this.props.data.map( (obj, index) => {
              return (
                <li key={index} className="list-group-item">
                  <div className="media">
                    <div className="media-left">
                      <a target="_blank" href={obj.html_url}>
                        <img width="60" className="media-object img-thumbnail" src={obj.avatar_url} alt={obj.login} />
                      </a>
                    </div>
                    <div className="media-body">
                      <h3 className="media-heading">{obj.login}</h3>
                      <p><b>TYPE:</b>{obj.type}</p>
                      <p><small>SCORE: <i>{similar(obj.login, this.props.tags)}</i></small></p>
                    </div>
                  </div>
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
class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      loading: false
    }
    this.onChange = this.onChange.bind(this);
  }

  /**
   * On input change
   * @param {object} e
   * @returns {string}
   */
  onChange (e) {
    const that = this;
    const val = e.currentTarget.value;
    const tags = val.replace(/\s+/g, "+");
    if(val.length < 3) {
      that.setState({ data: [], loading:false });
      return false;
    } else {
      that.setState({ loading: true, tags: tags });
    }
    $.getJSON("https://api.github.com/search/users?q=" + tags, (data) => {
      console.log(data)
      that.setState({ data: data.items, loading:false });
    });

  }

  render() {
    return (
      <div className="well">
        <div className="github-viewer">
          <h1><img className={this.state.loading ? 'logo loading' : 'logo'} width="60" src="https://assets-cdn.github.com/images/modules/logos_page/Octocat.png" />&nbsp;Q4 - Github user search</h1>
          <SearchBar onQueryChange={this.onChange} />
          <GithubViewer data={this.state.data} tags={this.state.tags} />
        </div>
      </div>
    )
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('app')
)
