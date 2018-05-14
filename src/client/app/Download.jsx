import PropTypes from 'prop-types';

const fake_click = (obj) => {
  let ev = document.createEvent('MouseEvents');
  ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  obj.dispatchEvent(ev);
};

const export_raw = (name, data) => {
  let urlObject = window.URL || window.webkitURL || window;
  let export_blob = new Blob([data]);
  let save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
  save_link.href = urlObject.createObjectURL(export_blob);
  save_link.download = name;
  fake_click(save_link);
};

const downloadFile = (fileName, fileContent) =>
  export_raw(fileName, typeof fileContent === 'function' ? fileContent() : fileContent);

const Download = ({ children, file, content, style, className }) => (
  <div className={`react-download-container ${className}`} onClick={() => downloadFile(file, content)} style={style}>
    {children}
  </div>
);

Download.propTypes = {
  file: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default Download;
