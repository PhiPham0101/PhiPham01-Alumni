import React from "react";
import { Grid, Typography } from "@material-ui/core";
import University from '../component/assets/University.mp4';

const Welcome = (props) => {
  return (
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      justify="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid>
        <div classname='App'>
          <video 
            src={University} 
            autoPlay 
            loop 
            muted 
            style = {{
              position: "absolute",
              width: "100%",
              left: "50%",
              top: "50%",
              height: "100%",
              objectFit: "cover",
              transform: "translate(-50%, -50%)",
              zIndex: "-1"
            }}
          />
        </div>
      </Grid>
      <Grid item>
        <Typography 
          style={{ 
            margin: "0",
            padding: "0",
            justifyContent: "center", 
            alignItems: "center", 
            display: "flex",
            flexDirection: "column",
            color: "darkorange"}} 
          variant="h1">
          Chào mừng đến Alumni IT
        </Typography>
        <Typography></Typography>
        <Typography></Typography>
        <Typography 
          style={{ 
            margin: "0",
            padding: "0",
            justifyContent: "center", 
            alignItems: "center", 
            display: "flex",
            flexDirection: "column",
            color: "#33CCFF"}} 
          variant="h3">
          (Ứng dụng web dành cho cựu sinh viên)
        </Typography>
        
      </Grid>
    </Grid>
  );
};

export const ErrorPage = (props) => {
  return (
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      justify="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid item>
        <Typography variant="h2">Error 404</Typography>
      </Grid>
    </Grid>
  );
};

export default Welcome;
