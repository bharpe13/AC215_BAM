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
        let error = '';
        console.log(event.target.files);
        if (event.target.value == null){
            error = "No image uploaded"
        }
        else {
            setImage(URL.createObjectURL(event.target.files[0]));

            var formData = new FormData();
            formData.append("file", event.target.files[0]);
            formData.append("neutral", baseText);
            formData.append("target", transformText);
            // console.log(baseText);
            // console.log(transformText)
            // setNewimage(URL.createObjectURL(event.target.files[0]));
            DataService.Predict(formData)
                .then(function (response) {
                    console.log(response.data);
                    // setPrediction(response.data);
                    setNewimage(response.data);
                    // if (transformText == "A face with glasses") {
                    //     setTimeout(function(){
                    //         setNewimage(michael);
                    //     }, 2000);
                    // }
                    // if (transformText == "A face with blonde hair") {
                    //     setTimeout(function(){
                    //         setNewimage(alex);
                    //     }, 2000);
                    // }
                    
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
                    {/* <form>
                        <label>
                            Enter Neutral Text:
                        </label>
                            <input type="text" value={baseText} onChange={handleBaseTextChange} />
                        

                        <label>
                            Enter Transformation Text:
                        </label>
                            <input type="text" value={transformText} onChange={handleTransformTextChange} />
                    </form> */}
                   
                        <Grid container spacing={4} direction="row" justify="center" alignItems="center">
                        <Grid item md={5}>

                            <TextField

                                label="Enter Neutral text:"
                                multiline
                                maxRows={1}
                                variant="outlined"
                                fullWidth
                                value={baseText}
                                onChange={handleBaseTextChange}
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
                                onChange={handleTransformTextChange}
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
                                <Icon className={classes.stopRecording} fontSize="large" color='secondary' onClick={handleOnChange}>auto_fix_high_icon</Icon>
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