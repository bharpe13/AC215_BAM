import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';

import TextField from '@material-ui/core/TextField';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';

import DataService from "../../services/DataService";
import styles from './styles';

import axios from 'axios';

const Home = (props) => {
    const { classes } = props;

    console.log("================================== Home ======================================");

    const inputFile = useRef(null);
    const [text, setText] = useState("");
    // Component States
    const [image, setImage] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [transformText, setTransformText] = useState("");
    const [baseText, setBaseText] = useState("");
    const [newimage, setNewimage] = useState(null);

    // Setup Component
    useEffect(() => {

    }, []);

    // Handlers
    const handleImageUploadClick = () => {
        inputFile.current.click();
    }

    const handleBaseTextChange = (event) => {
        let error = '';
        if (!event.target.value) {
            error = "Field cannot be empty"
        }
        setBaseText(event.target.value);
    }

    const handleTransformTextChange = (event) => {
        let error = '';
        if (!event.target.value) {
            error = "Field cannot be empty"
        }
        setTransformText(event.target.value);
    }

    const handleOnChange = (event) => {
        setImage(URL.createObjectURL(event.target.files[0]));
    }

    const handleOnClick = () => {
        let error = '';
        console.log(image);
        if (image == null){
            error = "No image uploaded"
        }
        else {

            var formData = new FormData();
            formData.append("file", image);
            formData.append("neutral", baseText);
            formData.append("target", transformText);
            DataService.Predict(formData)
                .then(function (response) {
                    console.log(response.data);
                    setNewimage(response.data);
                })
        }
        
    }

    return (
        <div className={classes.root}>
            <main className={classes.main}>
                <Container maxWidth="md" className={classes.container}>

                    <Typography variant="h3" color="secondary" gutterBottom>Try it Yourself! </Typography>
                    <div className={classes.dropzone} onClick={() => handleImageUploadClick()}>
                        <input
                            type="file"
                            accept="image/*"
                            capture="camera"
                            on
                            autocomplete="off"
                            tabindex="-1"
                            className={classes.fileInput}
                            ref={inputFile}
                            onChange={(event) => handleOnChange(event)}
                        />
                        <div> <img className={classes.preview} src={image} /></div>
                        <Typography className={classes.help}>Click to take a picture or upload...</Typography>
                    </div>
                   
                        <Grid container spacing={4} direction="row" justify="center" alignItems="center">
                        <Grid item md={5}>

                            <TextField

                                label="Enter Neutral text:"
                                multiline
                                maxRows={1}
                                variant="outlined"
                                fullWidth
                                value={baseText}
                                onChange={(event) => handleBaseTextChange(event)}
                            />
                            <br />
                            <br />
                        </Grid>  
                        <Grid item md={5}>  
                            <TextField

                                label="Enter Transformation text:"
                                multiline
                                maxRows={1}
                                variant="outlined"
                                fullWidth
                                value={transformText}
                                onChange={(event) => handleTransformTextChange(event)}
                            />
                            <br />
                            <br />
                          
                        </Grid> 
                    </Grid>
                    <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                justifyContent: 'center'
                            }}>
                                <Typography variant="h6" style={{ marginRight: '10px' }}> Click the magic wand to run! </Typography>
                                <Icon className={classes.stopRecording} fontSize="large" color='secondary' onClick={() => handleOnClick()}>auto_fix_high_icon</Icon>
                            </div>  
                   <div>

                   
                    <Card>
                        {newimage && (
                            <CardMedia
                                className={classes.photo}
                                image={DataService.GetImage(newimage.image)}
                                title="New image"
                            />
                        )}
                    </Card>
                    </div>
                </Container>
            </main>
        </div>
    );
};

export default withStyles(styles)(Home);