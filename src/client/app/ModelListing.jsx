import React, { Component } from 'react';
import AltContainer from 'alt-container';
import ListingModelsTable from './ListingModelsTable.jsx';
import ListingStore from '../stores/ListingStore.jsx';
import ListingActions from '../actions/ListingActions.jsx';
import Spinner from './Spinner.jsx';

export default class ModelListing extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    ListingActions.getAllModels();
  }

  render() {
    return (
      <AltContainer store={ListingStore}>
        <Spinner />
        <ListingModelsTable />
      </AltContainer>
    );
  }
}
