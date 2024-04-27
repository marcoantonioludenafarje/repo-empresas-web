import React, {useEffect, useRef} from 'react';
import {styled} from '@mui/material/styles';
import PropTypes from 'prop-types';
import SimpleBarReact from 'simplebar-react';
import 'simplebar/src/simplebar.css';

const StyledSimpleBarReact = styled(SimpleBarReact)(() => ({
  height: '100%',
  width: '100%',
}));

const AppScrollbar = (props) => {
  const {children, ...others} = props;
  const contentRef = useRef(null);

  useEffect(() => {
    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.scrollTop = contentElement.scrollHeight;
    }
  }, []);
  return (
    <StyledSimpleBarReact {...others}>
      <div ref={contentRef}>{children}</div>
    </StyledSimpleBarReact>
  );
};

export default AppScrollbar;

AppScrollbar.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
