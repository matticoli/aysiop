import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import { lightBlue } from '@material-ui/core/colors';
import { SnackbarProvider } from 'notistack';

import { CircularProgress, Grid, Link, List, ListItem, ListItemText, Paper } from '@material-ui/core';
import Axios from 'axios';

import Header from './Header';
import fb from './firebase';
import { ArrowUpwardSharp, CalendarTodayRounded, FolderRounded, ListRounded, MailRounded } from '@material-ui/icons';



const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
        h6: {
            marginTop: 15,
        }
    },
    palette: {
        type: 'dark',
        primary: {
            main: "#AC2B37",
        },
        secondary: {
            main: "#AC2B37",
        },
    },
});

const styles = theme => ({
    root: {
        textAlign: 'center',
        backgroundColor: '#303030',
        color: '#EEE',
        opacity: 1.0,
        visibility: 'visible',
        transition: 'opacity 100ms 0ms'
    },
    rootHidden: {
        width: '100%',
        height: '100%',
        textAlign: 'center',
        backgroundColor: '#303030',
        color: '#EEE',
        opacity: 0.0,
        visibility: 'hidden',
    },
    shown: {
        opacity: 1.0,
        visibility: 'visible',
        transition: 'opacity 500ms 0ms'
    },
    hidden: {
        opacity: 0.0,
        visibility: 'hidden',
        transition: 'opacity 500ms 0ms',
    },
    switch: {
        margin: theme.spacing(2),
        maxWidth: 1500,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    paper: {
        padding: theme.spacing(2),
        margin: theme.spacing(1),
        backgroundColor: "#333",
    }
});

const App = (props) => {
    const classes = props.classes;
    
    const [app, setApp] = useState(undefined);
    const [user, setUser] = useState(undefined);
    const [rootClass, setRootClass] = useState(classes.rootHidden);
    const [appClass, setAppClass] = useState(classes.hidden);
    const [mail, setMail] = useState(undefined);
    const [calendar, setCalendar] = useState(undefined);
    const [canvas, setCanvas] = useState(undefined);
    const [files, setFiles] = useState(undefined);
    const [photo, setPhoto] = useState(undefined);

    useEffect(() => {
        console.log("fb init ueff")
        setRootClass(classes.root);
        if (!fb.app) {
            console.log("appInit")
            fb.initialize((user) => {
                setUser(user);
                setApp(fb.app);
                setAppClass(classes.shown);
            });
        }
    }, [classes.root, classes.shown, user]);

    useEffect(() => {
        if(user) {
            Axios.get('https://graph.microsoft.com/v1.0/me/messages', {
                headers: { Authorization: `Bearer ${fb.access}` }
            }).then(resp => {
                setMail(resp.data.value);
            });
            
            Axios.get('https://graph.microsoft.com/v1.0/me/drive/root/children', {
                headers: { Authorization: `Bearer ${fb.access}` }
            }).then(resp => {
                let dat = resp.data.value.sort((a, b) => {
                    return new Date(b.lastModifiedDateTime) - new Date(a.lastModifiedDateTime);
                })
                setFiles(dat);
            });
            
            const now = new Date();
            let later = new Date();
            later.setDate(later.getDate() + 14);
            Axios.get(`https://graph.microsoft.com/v1.0/me/reminderView(startDateTime='${now.toISOString()}',endDateTime='${later.toISOString()}')`, {
                headers: { Authorization: `Bearer ${fb.access}` }
            }).then(resp => {
                setCalendar(resp.data.value);
            });

            Axios.get('/canvas').then(resp => {
                console.log(resp);
                let dat = resp.data.sort((a, b) => {
                    return new Date(b.start_at) - new Date(a.start_at);
                })
                setCanvas(resp.data);
            });

            Axios.get("https://graph.microsoft.com/v1.0/me/Photo/$value", {
                headers: { Authorization: `Bearer ${fb.access}` },
                responseType: 'blob'
            }).then(resp => {
                const url = window.URL || window.webkitURL;
                const blobUrl = url.createObjectURL(resp.data);
                setPhoto(blobUrl);
            }).catch(err => {
                console.error("Failed to get user photo");
            })
        } else {
            setMail(undefined);
            setPhoto(undefined);
        }
    }, [user]);

    return (
        <div className={rootClass}>
            {!app && <div>
                <br />
                <br />
                <h3>One moment, please...</h3>
                <CircularProgress />
            </div>}
            {app && 
                <div className={appClass}>
                    <Router>
                        <MuiThemeProvider theme={theme}>
                            <SnackbarProvider maxSnack={1}
                                              anchorOrigin={{
                                                  vertical: 'bottom',
                                                  horizontal: 'right'
                                              }}
                                              classes={{containerRoot: classes.snackbarContainer}}>
                                <Header user={user} photo={photo} />
                                {!user &&
                                    <h3 style={{marginLeft: 10, textAlign: 'left'}}>
                                        <ArrowUpwardSharp/><ArrowUpwardSharp/><ArrowUpwardSharp/>
                                        <br/>
                                        Please sign in to continue (See MENU)
                                    </h3>
                                }
                                {user && !mail &&
                                    <div>
                                        <CircularProgress /> Loading...
                                    </div>
                                }
                                    <div className={classes.switch}>
                                        <Switch>
                                            <Route exact path="/">
                                                <Grid container>
                                                    {user && mail &&
                                                        <Grid item xs={12} sm={3}>
                                                            <Paper elevation={3} className={classes.paper} >
                                                                <h3>Recent Emails</h3>
                                                                <MailRounded />
                                                                <List>
                                                                    {mail.map(msg => {
                                                                        return (
                                                                            <ListItem button onClick={() => window.open(msg.webLink, '_blank')}>
                                                                                <ListItemText primary={msg.subject} secondary={msg.sender.emailAddress.address} />
                                                                            </ListItem>
                                                                        )
                                                                    })}
                                                                </List>
                                                                <List>
                                                                    {mail.map(msg => {
                                                                        return (
                                                                            <ListItem button onClick={() => window.open(msg.webLink, '_blank')}>
                                                                                <ListItemText primary={msg.subject} secondary={msg.sender.emailAddress.address} />
                                                                            </ListItem>
                                                                        )
                                                                    })}
                                                                </List>
                                                            </Paper>
                                                        </Grid>
                                                    }
                                                    {user && calendar &&
                                                        <Grid item xs={12} sm={3}>
                                                            <Paper elevation={3} className={classes.paper} >
                                                                <h3>Upcoming Events</h3>
                                                                <CalendarTodayRounded />
                                                                <List>
                                                                    {calendar.map(evt => {
                                                                        console.log(evt);
                                                                        const start = new Date(evt.eventStartTime.dateTime).toString().replace('(Eastern Standard Time)', 'EST');
                                                                        const end = new Date(evt.eventEndTime.dateTime).toString().replace('(Eastern Standard Time)', 'EST');
                                                                        const loc = evt.eventLocation.displayName;
                                                                        return (
                                                                            <ListItem button onClick={() => window.open(evt.eventWebLink, '_blank')}>
                                                                                <ListItemText primary={evt.eventSubject} 
                                                                                              secondary={<div>
                                                                                                            {`${start} - ${end}`}
                                                                                                            <br />
                                                                                                            {loc}
                                                                                                        </div>} />
                                                                            </ListItem>
                                                                        )
                                                                    })}
                                                                </List>
                                                            </Paper>
                                                        </Grid>
                                                    }
                                                    {user && canvas &&
                                                        <Grid item xs={12} sm={3}>
                                                            <Paper elevation={3} className={classes.paper} >
                                                                <h3>Courses/Assignments</h3>
                                                                <ListRounded />
                                                                <List>
                                                                    {canvas.map(course => {
                                                                        return (
                                                                            <ListItem button onClick={() => window.open(evt.eventWebLink, '_blank')}>
                                                                                <ListItemText primary={`${course.name}`} 
                                                                                              secondary={`${course.course_code} | Pending Assignments: None`} />
                                                                            </ListItem>
                                                                        )
                                                                    })}
                                                                </List>
                                                            </Paper>
                                                        </Grid>
                                                    }
                                                    {user && files &&
                                                        <Grid item xs={12} sm={3}>
                                                            <Paper elevation={3} className={classes.paper} >
                                                                <h3>Recent Files</h3>
                                                                <FolderRounded />
                                                                <List>
                                                                    {files.map(f => {
                                                                        return (
                                                                            <ListItem button onClick={() => window.open(f.webLink, '_blank')}>
                                                                                <ListItemText primary={`${f.name}`} 
                                                                                              secondary={`${new Date(f.lastModifiedDateTime).toString().replace('(Eastern Standard Time)', 'EST')}`} />
                                                                            </ListItem>
                                                                        )
                                                                    })}
                                                                </List>
                                                            </Paper>
                                                        </Grid>
                                                    }
                                                </Grid>
                                            </Route>
                                        </Switch>
                                    </div>
                            </SnackbarProvider>
                        </MuiThemeProvider>
                    </Router>
                </div>
            }
        </div>
    );
}

export default withStyles(styles)(App);