import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
  },
  iconButtonContainerLeft: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  iconButtonContainerRight: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

export default function CardButtons({
  right,
  left,
}) {
  const classes = useStyles();

  return (
    <div container justify="space-between" className={classes.root}>
      <div item xs={6} className={classes.iconButtonContainerLeft}>
        <IconButton
          onClick={left}
          aria-label="dislike"
          className={classes.margin}
        >
          <ThumbDownIcon color="secondary" fontSize="large" />
        </IconButton>
      </div>

      <div item xs={6} className={classes.iconButtonContainerRight}>
        <IconButton
          onClick={right}
          aria-label="like"
          className={classes.margin}
        >
          <ThumbUpIcon color="primary" fontSize="large" />
        </IconButton>
      </div>
    </div>
  );
}