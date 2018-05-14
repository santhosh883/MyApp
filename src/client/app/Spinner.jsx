import PropTypes from 'prop-types';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import Theme from '../utils/theme.js';

const styles = {
  refreshContainer: {
    left: '50%',
    margin: 'auto',
    position: 'fixed',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
  },
  refresh: {
    display: 'inline-block',
    position: 'relative',
  },
};

const Spinner = ({ opacity, size, isLoading }) =>
  isLoading && (
    <div style={merge(styles.refreshContainer, { opacity })}>
      <RefreshIndicator
        size={size}
        left={0}
        top={0}
        loadingColor={Theme.palette.headerGrey}
        status="loading"
        style={styles.refresh}
      />
    </div>
  );

Spinner.defaultProps = {
  isLoading: true,
  opacity: 0.7,
  size: 50,
};

Spinner.propTypes = {
  isLoading: PropTypes.bool,
  opacity: PropTypes.number,
  size: PropTypes.number,
};

export default Spinner;
