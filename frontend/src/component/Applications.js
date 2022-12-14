import React from "react";
import { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  Paper,
  TextField,
  Typography,
  Modal,
  Slider,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Checkbox,
} from "@material-ui/core";
import axios from "axios";
import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  statusBlock: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "uppercase",
  },
  jobTileOuter: {
    padding: "30px",
    margin: "20px 0",
    boxSizing: "border-box",
    width: "100%",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const ApplicationTile = (props) => {
  const classes = useStyles();
  const { application } = props;
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);

  const appliedOn = new Date(application.dateOfApplication);
  const joinedOn = new Date(application.dateOfJoining);

  // const fetchRating = () => {
  //   axios
  //     .get(`${apiList.rating}?id=${application.job._id}`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     })
  //     .then((response) => {

  //       console.log(response.data);
  //     })
  //     .catch((err) => {
  //       // console.log(err.response);
  //       console.log(err.response.data);
  //       setPopup({
  //         open: true,
  //         severity: "error",
  //         message: "Error",
  //       });
  //     });
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  const colorSet = {
    applied: "#3454D1",
    accepted: "#09BC8A",
    //rejected: "#D1345B",
    //deleted: "#B49A67",
    cancelled: "#D1345B",
    finished: "#808080",
  };

  return (
    <Paper className={classes.jobTileOuter} elevation={3}>
      <Grid container>
        <Grid container item xs={9} spacing={1} direction="column">
          <Grid item>
            <Typography variant="h5">{application.job.title}</Typography>
          </Grid>
          <Grid item>T??n c??ng ty: {application.job.companyname}</Grid>
          <Grid item>Link website tuy???n d???ng: {application.job.linkwebsite}</Grid>
          <Grid item>Ng?????i ????ng: {application.recruiter.name}</Grid>
          <Grid item>Lo???i c??ng vi???c: {application.job.jobType}</Grid>
          <Grid item>L????ng: {application.job.salary}000 (VN??)</Grid>
          <Grid item>
            {application.job.skillsets.map((skill) => (
              <Chip label={skill} style={{ marginRight: "2px" }} />
            ))}
          </Grid>
          <Grid item>???? ????ng k??: {appliedOn.toLocaleDateString()}</Grid>
          {application.status === "accepted" ||
          application.status === "finished" ? (
            <Grid item>???? ???????c duy???t: {joinedOn.toLocaleDateString()}</Grid>
            
          ) : null}
          {application.status === "finished" ? (
            <Grid item style={{ color: "blue" }}>
              L?? do kh??ng ???????c nh???n: {application.sopcancel !== "" ? application.sopcancel : "Kh??ng ???????c g???i"}
            </Grid>

          ) : null}
        </Grid>
        <Grid item container direction="column" xs={3}>
          <Grid item xs>
            <Paper
              className={classes.statusBlock}
              style={{
                background: colorSet[application.status],
                color: "#ffffff",
              }}
            >
              {application.status}
            </Paper>
          </Grid>
          {application.status === "finished" ? (
            <Grid item>
              {/* L?? do: {application.sopcancel !== "" ? application.sopcancel : "Kh??ng ???????c g???i"} */}
            </Grid>

          ) : null}
        </Grid>
      </Grid>
    </Paper>
  );
};

const Applications = (props) => {
  const setPopup = useContext(SetPopupContext);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(apiList.applications, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        //console.log(response.data);
        setApplications(response.data);
      })
      .catch((err) => {
        // console.log(err.response);
        //console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  return (
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid item>
        <Typography variant="h3">Danh s??ch ???ng tuy???n</Typography>
      </Grid>
      <Grid
        container
        item
        xs
        direction="column"
        style={{ width: "100%" }}
        alignItems="stretch"
        justify="center"
      >
        {applications.length > 0 ? (
          applications.map((obj) => (
            <Grid item>
              <ApplicationTile application={obj} />
            </Grid>
          ))
        ) : (
          <Typography variant="h5" style={{ textAlign: "center" }}>
            Kh??ng t??m th???y h??? s?? ???ng tuy???n!
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default Applications;
