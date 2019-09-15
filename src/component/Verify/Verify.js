import React, {Component} from "react";
import {
    AppRegistry,
    View,
    Text,
    Image,
    ImageBackground,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Dimensions,
    ActivityIndicator,
    NativeModules, Alert
} from "react-native";

// import Key from Config.goolge_vision_key;
import RNFS from 'react-native-fs';
// import Spinner from 'react-native-spinkit';
import Config from "../../Config";
import {Col, Grid, Icon} from 'native-base';
import {Actions} from 'react-native-router-flux';

// import RNTesseractOcr from 'react-native-tesseract-ocr';
import ImageResizer from 'react-native-image-resizer';

export default class TakePhoto extends Component {
    constructor() {
        super()
        this.state = {
            loading: false,
            extractedText: ''
        }
    }

    // static navigationOptions = {
    //   title: "Verify",
    //   header: null
    // };

    // componentWillMount() {
    //   StatusBar.setHidden(true);
    // }

    cleanData(data) {

        this.setState({
            loading: false,
            imgPath: ''
        })

        // const cleanedData = JSON.parse(data._bodyText).responses[0].fullTextAnnotation.text;
        try {
            // console.log("========================");
            // console.log(data);
            // console.log("========================");
            var arr = data;
            var textDetect = '';
            for (var i = 0; i < arr.length; i++) {
                var element = arr[i];
                // console.log(element);
                // console.log(element.description_);
                // Do something with element
                if (element.description_.length > textDetect.length) {
                    textDetect = element.description_;
                }
            }
            console.log(textDetect);
            console.log(this.state.imgPath);

            Actions.home({textDetect: textDetect, capturePhotoPath: this.props.captureData.uri});
        } catch (e) {
            console.log(e);
        }

        //
        // this.props.navigation.navigate('ImageResult', {
        //   path: cleanedData,
        //   homeKey: this.props.navigation.state.params.homeKey,
        //   cameraKey: this.props.navigation.state.key
        // })
    }

    async usePhoto(imgPath) {

        this.setState({
            loading: true
        })
        // console.log('imgPath ' + imgPath);
        //console.log(Config.goolge_vision_key);
        //imgPath = `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`;
        try {
            let temp = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=` + Config.goolge_vision_key, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    // 'Authorization': 'Bearer ' + Config.goolge_vision_key,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "requests": [
                        {
                            "image": {
                                "content": imgPath
                            },
                            "features": [
                                {
                                    "type": "TEXT_DETECTION"
                                }
                            ]
                        }
                    ]
                })
            });
            var jsonObjTemp = await temp.json();
            console.log(jsonObjTemp);


            let formdata = new FormData();
            formdata.append("image", imgPath);
            var fetchData = await fetch(`http://103.94.16.226:8086/api/getTextDetection`, {
                method: 'POST',
                body: formdata
            });

            var jsonObj = await fetchData.json();
            this.cleanData(jsonObj);

        } catch (err) {
            console.log(err);
        }
    }

    _compressImage() {
        try {
            let imgPath = this.props.captureData.uri;
            console.log('++++++++imgPath ' + imgPath);
            this.setState({imgPath: imgPath});
            let newWidth = 800;
            let newHeight = 640;
            // ImageResizer.createResizedImage(imgPath, newWidth, newHeight,
            //     'png', 100, 180, imgPath).then(async (response) => {
            //     // response.uri is the URI of the new image that can now be displayed, uploaded...
            //     // response.path is the path of the new image
            //     // response.name is the name of the new image with the extension
            //     // response.size is the size of the new image
            //     const readInfo = await RNFS.readFile(imgPath, 'base64');
            //     this.usePhoto(readInfo);
            // }).catch((err) => {
            //     // Oops, something went wrong. Check that the filename is correct and
            //     // inspect err to get more details.
            //     console.log(err);
            //     alert('Error');
            // });

            ImageResizer.createResizedImage(imgPath, newWidth, newHeight, 'JPEG', 100)
                .then(({uri}) => {
                    console.log('++++++++new uri ' + uri);
                    this.convertImg(uri);
                })
                .catch(err => {
                    console.log(err);
                    return Alert.alert('Unable to resize the photo', 'Check the console for full the error message');
                });
        } catch (err) {
            console.log({err})
        }
    }

    async convertImg(imgPath) {

        //from camera /Users/jbecks/Library/Developer/CoreSimulator/Devices/D9FE59D4-5706-4B0B-98D7-9D7B9519D18A/data/Containers/Data/Application/CCDC4308-F7FA-443A-B9B1-0DEBBDF93C01/Documents/24D6D353-B8FA-414F-ADEC-92B672FD056D.jpg

        //from cameraRoll assets-library://asset/asset.JPG?id=729F50DA-9627-42A9-802D-69B22C9EECD2&ext=JPG

        // const imgPath = this.props.navigation.state.params.path;

        //const imgPath = this.props.captureData.uri;
        console.log(imgPath);
        // const tessOptions = {
        //     whitelist: null,
        //     blacklist: null
        // };
        //
        // var temp = imgPath.replace('file://', '');
        // RNTesseractOcr.recognize(temp, 'LANG_ENGLISH', tessOptions)
        //     .then((result) => {
        //         console.log(result);
        //         alert(result);
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //         alert(err);
        //     });
        //

        try {
            const readInfo = await RNFS.readFile(imgPath, 'base64');
            this.usePhoto(readInfo);
        } catch (err) {
            console.log({err})
        }
    }


    render() {

        // console.log('key in verify', this.props.navigation.state.params.homeKey)

        // const { state, goBack } = this.props.navigation;

        return (
            <View>
                <ActivityIndicator
                    animating={this.state.loading}
                    color={Config.mainColor}
                    size="large"
                />
                <ImageBackground
                    style={styles.img}
                    source={{
                        uri: this.props.captureData.uri
                    }}>

                    <View style={styles.topBar}/>

                    {/*<Spinner isVisible={ this.state.loading }*/}
                    {/*size={ 100 }*/}
                    {/*type={ 'Wave' }*/}
                    {/*color={ '#3DD8CE' } />*/}

                </ImageBackground>

                <View style={styles.bottomBar}>
                    <Grid>
                        <Col>
                            <TouchableOpacity onPress={() => Actions.pop()}>
                                {/*<Image source={require("../../../assets/left-arrow.png")}*/}
                                {/*style={ styles.icon } />*/}
                                <View style={styles.camBtn}>
                                    <Icon name='ios-arrow-back'/>
                                    <Text style={styles.btnTxt}> Quay lại</Text>
                                </View>
                            </TouchableOpacity>
                        </Col>
                        <Col>
                            <TouchableOpacity onPress={this._compressImage.bind(this)}>
                                {/*<Image source={require("../../../assets/send.png")}*/}
                                {/*style={ styles.icon } />*/}
                                <View style={styles.camBtn}>
                                    <Icon name='ios-camera'/>
                                    <Text style={styles.btnTxt}> Dùng ảnh</Text>
                                </View>
                            </TouchableOpacity>
                        </Col>
                    </Grid>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    },

    img: {
        // flexDirection: "column",
        alignItems: 'center',
        justifyContent: "center",
        height: Dimensions.get("window").width,
        width: Dimensions.get("window").width
    },
    camBtn: {
        //marginLeft:12,
        // marginTop: 15,
        flexDirection: 'column',
        marginBottom: 23,
        alignItems: 'center',
        justifyContent: 'center',
    },
    topBar: {
        backgroundColor: "rgba(0,0,0,1)",
        height: 20,
        width: "100%"
    },

    bottomBar: {
        alignSelf: 'flex-end',
        backgroundColor: "white",
        flexDirection: 'row',
        height: 80,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    Btn: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        marginTop: 10,
    },

    goBackBtn: {
        marginLeft: 15
    },

    btnTxt: {
        color: Config.mainColor
    },

    submitBtn: {
        marginRight: 15
    },

    icon: {
        height: 25,
        width: 25
    }
});

/*

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

 */