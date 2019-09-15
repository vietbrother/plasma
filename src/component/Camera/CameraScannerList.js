import React, {Component} from "react";
import {
    AppRegistry,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions
} from "react-native";
import {Icon} from 'native-base';

// import Camera from "react-native-camera";
import {RNCamera} from 'react-native-camera';

import Config from "../../Config";
import {Actions} from 'react-native-router-flux';

export default class CameraScannerList extends Component {

    takePicture = async () => {
        try {
            const data = await this.camera.takePictureAsync();
            console.log('Path to image: ' + data.uri);
            Actions.verify({captureData: data});
        } catch (err) {
            console.log('err: ', err);
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <RNCamera
                    ref={cam => {
                        this.camera = cam;
                    }}
                    style={styles.cam}
                    captureAudio={false}
                >
                    <View style={styles.bottomBar}>
                        <TouchableOpacity onPress={this.takePicture}>
                            <View style={styles.camBtn}>
                                <Icon name='ios-camera'/>
                                {/*<Text>{Config.btnCamera}</Text>*/}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{Actions.home({textDetect: 'HN05059', capturePhotoPath: ''});}}>
                            <View style={styles.camBtn}>
                                <Text>Test</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </RNCamera>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingBottom: 10,
        // backgroundColor: '#000',
    },
    cam: {
        justifyContent: "flex-end",
        alignItems: "center",
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width
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

    camBtn: {
        height: 50,
        width: 50,
        borderRadius: 50,
        borderWidth: 1.3,
        borderColor: "#d6d7da",
        //marginLeft:12,
        // marginTop: 15,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    Btn: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: 60,
        marginTop: 10
    },

    goBackBtn: {
        marginLeft: 15
    },

    btnTxt: {
        color: 'white'
    },

    submitBtn: {
        marginRight: 15,
        width: 55
    },

    icon: {
        height: 30,
        width: 30
    }
});
