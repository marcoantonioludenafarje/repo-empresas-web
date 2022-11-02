import React from 'react';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import PropTypes from 'prop-types';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import {alpha, styled} from '@mui/material/styles';
import {Fonts} from '../../../../shared/constants/AppEnums';
import {useRouter} from 'next/router';
import Link from 'next/link';
import clsx from 'clsx';

const StyledListItem = styled(ListItem)(({theme}) => ({
  paddingTop: 5,
  paddingBottom: 5,
  paddingLeft: 16,
  paddingRight: 16,
  borderRadius: '0 30px 30px 0',
  marginBottom: 1,
  marginTop: 1,
  [theme.breakpoints.up('md')]: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 24,
    paddingRight: 24,
  },

  '& .MuiSvgIcon-root': {
    marginRight: 14,
    fontSize: 20,
  },

  '&:hover,&:focus,&.active': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
  },

  '&.active': {
    color: theme.palette.primary.main,
    '& $listItemText': {
      '& .MuiTypography-body1': {
        fontWeight: Fonts.SEMI_BOLD,
      },
    },
  },
}));

const LabelItem = ({label}) => {
  const {query} = useRouter();
  return (
    <Link href={`/sample/todo/label/${label.alias}`}>
      <StyledListItem
        button
        key={label.id}
        className={clsx({
          active: label.alias === query.all[1],
        })}
      >
        <LabelOutlinedIcon style={{color: `${label.color}`}} />
        <ListItemText
          sx={{
            '& .MuiTypography-body1': {
              fontSize: 14,
            },
          }}
          primary={label.name}
        />
      </StyledListItem>
    </Link>
  );
};

export default LabelItem;

LabelItem.propTypes = {
  label: PropTypes.object.isRequired,
};
