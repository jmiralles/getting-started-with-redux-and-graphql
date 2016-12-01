import React from 'react';
import { connect } from 'react-redux';
import { getGraph } from '../actions/actions.js';

let Query = React.createClass({
  componentDidMount() {
    this.props.dispatch(getGraph("{budget(id: 2) {id, name}}"));
  },
  render() {
    let dispatch = this.props.dispatch;
    let fetchInProgress = String(this.props.store.get('fetching'));
    let queryText;
    let budget = this.props.store.get('data').toObject();
    return (
      <div>
        <p>Fetch in progress: {fetchInProgress}</p>
        <h3>{ budget.name }</h3>
        <input ref={node => {queryText = node}}></input>
        <button onClick={() => {dispatch(getGraph(queryText.value))}}>
          query
        </button>
      </div>
    )
  }
});

const mapStateToProps = (state) => {
  return {
    store: state
  }
};

export const QueryContainer = connect(
  mapStateToProps
)(Query);
