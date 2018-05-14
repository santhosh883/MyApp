import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import CopyIcon from 'material-ui/svg-icons/image/filter-none';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';
import TestIcon from 'material-ui/svg-icons/action/bug-report';
import TrashIcon from 'material-ui/svg-icons/action/delete';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import Check from 'material-ui/svg-icons/navigation/check';
import { FlexBox } from './FlexBox.jsx';
import Download from './Download.jsx';
import DataTableActions from '../actions/DataTableActions.js';

const styles = {
  root: {
    width: '100%',
    margin: 'auto',
    border: '1px solid #A2A2A2',
  },
  tableRowColumn: {
    borderRight: '1px solid #A2A2A2',
    fontSize: 15,
  },
  a: {
    color: '#0067b4',
    cursor: 'pointer',
  },
  downloadLink: {
    display: 'inline',
  },
  header: {
    backgroundColor: '#CFCFCF',
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 15,
  },
  icon: {
    color: '#0067b4',
    fontSize: 15,
  },
  iconHover: {
    cursor: 'pointer',
  },
};

const showHideDeleteConfirmation = (row, flag) =>
  DataTableActions.showHideDeleteConfirmation({ deletable: row, flag: flag });

const DeleteConfirmation = ({ row, handleDelete, isDeleting }) => (
  <span>
    {!isDeleting(row) ? (
      <IconButton iconStyle={styles.icon} onClick={() => showHideDeleteConfirmation(row, true)}>
        <TrashIcon />
      </IconButton>
    ) : (
      <span>
        <IconButton iconStyle={styles.icon} onClick={() => showHideDeleteConfirmation(row, false)}>
          <Refresh />
        </IconButton>
        <IconButton iconStyle={styles.icon} onClick={() => handleDelete(row)}>
          <Check />
        </IconButton>
      </span>
    )}
  </span>
);

const Row = ({ row, headers, deletable, handleDelete, isDeleting, i }) => (
  <TableRow key={`tr-${i}`} style={{ background: i % 2 === 0 ? '#f0f0f0' : '#ffffff', height: '35px' }}>
    {headers.map((y, k) => (
      <TableRowColumn key={`trc-${k}`} style={styles.tableRowColumn}>
        {row[y.prop]}
      </TableRowColumn>
    ))}
    <TableRowColumn>
      <IconButton>
        <Download file={`${row.name}.json`} content={row.toString()} style={styles.downloadLink}>
          <DownloadIcon style={styles.icon} />
        </Download>
      </IconButton>
      {deletable && <DeleteConfirmation row={row} handleDelete={handleDelete} isDeleting={isDeleting} />}
    </TableRowColumn>
  </TableRow>
);

const DataTable = ({ data, headers, deletable, handleDelete, isDeleting }) => (
  <FlexBox style={styles.root}>
    <Table>
      <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
        <TableRow>
          {headers.map((x, i) => (
            <TableHeaderColumn style={styles.header} key={`thc-${i}`}>
              {x.name}
            </TableHeaderColumn>
          ))}
          <TableHeaderColumn style={styles.header}>Actions</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody displayRowCheckbox={false}>
        {data &&
          data.map((x, i) => (
            <Row
              row={x}
              headers={headers}
              deletable={deletable}
              handleDelete={handleDelete}
              isDeleting={isDeleting}
              i={i}
              key={i}
            />
          ))}
      </TableBody>
    </Table>
  </FlexBox>
);
DataTable.propTypes = {
  data: PropTypes.object,
  headers: PropTypes.array,
  isDeleting: PropTypes.func,
  deletable: PropTypes.bool,
  handleDelete: PropTypes.func,
};

const defaultFunction = () => {};
DataTable.defaultProps = {
  deletable: false,
  handleDelete: defaultFunction,
};

export default DataTable;
