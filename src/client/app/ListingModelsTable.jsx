import AltContainer from 'alt-container';
import { store } from '../utils/functional.js';
import PropTypes from 'prop-types';
import DataTable from './DataTable.jsx';
import PersistenceAction from '../actions/PersistenceActions.jsx';
import DataTableStore from '../stores/DataTableStore.js';

const headers = [
  {
    name: 'Name',
    prop: 'name',
    type: 'string',
  },
  {
    name: 'Last Modified',
    prop: 'lastModifiedDate',
    type: 'date',
  },
];

const deleteClicked = (model) => PersistenceAction.deleteModel(model);

const ListingModelsTable = ({ models }) => {
  return (
    <AltContainer store={DataTableStore}>
      <DataTable data={models} headers={headers} deletable handleDelete={deleteClicked} />
    </AltContainer>
  );
};

ListingModelsTable.propTypes = {
  models: PropTypes.object,
};

export default ListingModelsTable;
