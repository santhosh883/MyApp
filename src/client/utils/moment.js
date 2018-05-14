import Moment from 'react-moment';

Moment.globalFilter = d => {
  return d.toUpperCase();
};
