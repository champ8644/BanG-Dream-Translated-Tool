import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { styles } from '../styles';
import { withStyles } from '@material-ui/core/styles';

function HNsearchbox(props) {
  const { classes: styles, handleChangeHN, HN, handleSubmitHN } = props;
  return (
    <Paper className={clsx(styles.paper, styles.doubleMargin)}>
      <Grid container alignItems='center'>
        <Grid item className={styles.frontHN}>
          <Typography variant='h4'>Enter HN: </Typography>
        </Grid>
        <Grid item xs>
          <FormControl
            className={clsx(styles.margin, styles.textField)}
            variant='outlined'
          >
            <InputLabel>Hospital number</InputLabel>
            <OutlinedInput
              id='input-hn'
              type='search'
              value={HN}
              onChange={e => handleChangeHN(e.target.value)}
              onKeyPress={e => (e.key === 'Enter' ? handleSubmitHN() : null)}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton onClick={handleSubmitHN} edge='end'>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={120}
            />
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default withStyles(styles)(HNsearchbox);
