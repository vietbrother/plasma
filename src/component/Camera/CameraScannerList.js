import React, {Component} from "react";
import {
    AppRegistry,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Modal, Alert
} from "react-native";
import {Button, Container, Icon, CardItem, Left, Right,} from 'native-base';

import {RNCamera} from 'react-native-camera';

import Config from "../../Config";
import {Actions} from 'react-native-router-flux';
import Spinner from 'react-native-loading-spinner-overlay';
import ImageResizer from "react-native-image-resizer";
import RNFS from "react-native-fs";

export default class CameraScannerList extends Component {

    constructor() {
        super()
        this.state = {
            isLoading: false,
            extractedText: '',
            imgPath: '',
            products: [],
            textDetect: '',
            responseUpdate: '',
            newStage: 0,
            oldStage: '',

            customerId: '',
            customerName: '',
            numberDeviceCurrent: 0,
            numberDeviceTotal: 0,
            deviceList: []
        }
    }

    componentDidMount(): void {
        this.setState({
            customerId: this.props.customer_id,
            customerName: this.props.customer_name,
            numberDeviceTotal: this.props.numberDeviceScan,
        })
    }

    takePicture = async () => {
        try {
            this.setState({isLoading: true});
            const data = await this.camera.takePictureAsync();
            console.log('Path to image: ' + data.uri);
            this._actionDetectLabel(data.uri);
        } catch (err) {
            console.log('err: ', err);
            this.setState({isLoading: false});
        }
    };

    _actionDetectLabel(imgPath) {
        try {
            //compress image
            //let imgPath = this.props.captureData.uri;
            console.log('++++++++imgPath ' + imgPath);
            this.setState({imgPath: imgPath});
            //let newWidth = 800;
            //let newHeight = 640;
            let newWidth = Config.imageWidth;
            let newHeight = Config.imageHeight;

            ImageResizer.createResizedImage(imgPath, newWidth, newHeight, 'JPEG', 100)
                .then(({uri}) => {
                    console.log('++++++++new uri ' + uri);
                    this._actionCallVisionApi(uri);
                })
                .catch(err => {
                    console.log(err);
                    return Alert.alert('Có lỗi xảy ra', 'Lỗi khi nén file ảnh');
                });
        } catch (err) {
            console.log({err})
            this.setState({isLoading: false});
        }
    }

    async _actionCallVisionApi(imgPath) {
        console.log(imgPath);
        try {
            //convertImg
            const imgBase64Content = await RNFS.readFile(imgPath, 'base64');
            this.setState({
                loading: true
            })
            try {
                let response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=` + Config.goolge_vision_key, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "requests": [
                            {
                                "image": {
                                    "content": imgBase64Content
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
                var responseObj = await response.json();
                console.log(responseObj);

                //parser data
                var textDetect = '';
                try {
                    var arr = responseObj.responses;
                    for (var i = 0; i < arr.length; i++) {
                        var element = arr[i];
                        console.log(element);
                        var tempLabel = element.fullTextAnnotation == null ? '' : element.fullTextAnnotation.text;
                        if (tempLabel.length > textDetect.length) {
                            textDetect = tempLabel;
                        }
                    }
                    console.log(textDetect);
                    if (textDetect != null && textDetect != '') {
                        textDetect = textDetect.trim().replace('O', '0');
                        var res = textDetect.match(/[A-Z]+\d+/g);
                        if (res != null) {
                            textDetect = res[0];
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
                console.log(textDetect);
                this.setState({isLoading: false});
                this._getDeviceInfo(textDetect);
            } catch (err) {
                console.log(err);
                this.setState({isLoading: false});
                alert('Không thể phân tích mã thiết bị.');
            }
        } catch (err) {
            console.log({err});
            this.setState({isLoading: false});
            alert('Không thể phân tích ảnh. Xin thử lại.');
        }
    }


    _getDeviceInfo(textDetect): void {
        try {
            this.setState({isLoading: true, textDetect: textDetect});
            // Connect to Odoo
            global.odooAPI.connect(function (err) {
                if (err) {
                    console.log('--------------connect error');
                    this.setState({isLoading: false});
                    return console.log(err);
                }
            });

            let codeDevice = textDetect;
            var params = {
                domain: [['code', '=', codeDevice]],
                fields: ['id', 'code', 'stage', 'warehouse', 'p_customer', 'description'],
                order: 'id',
                limit: 15,
                offset: 0,
            }; //params
            global.odooAPI.search_read('p.equipment', params, this._getResSearch.bind(this)); //search_read
        } catch (e) {
            console.log(e);
            alert('Lấy thông tin bình ' + this.state.textDetect + ' thất bại! ');
            this.setState({isLoading: false});
        }
    }

    _getResSearch(err, products) {
        this.setState({isLoading: false});
        if (err) {
            alert(err);
            return console.log(err);
        }
        console.log('==========================================');
        console.log(products);
        console.log('__________________________');
        try {
            if (products == null || products.length < 1) {
                this.setState({isLoading: false});
                alert('Không tìm thấy thông tin bình ' + this.state.textDetect);
                return;
            }
            this._addToOrder(products[0]);
        } catch (e) {
            console.log(e);
            alert('Lấy thông tin bình ' + this.state.textDetect + ' thất bại! ');
            this.setState({isLoading: false, products: []});
        }
    }


    _addToOrder(device) {
        var temp = [];
        temp.push(device);
        var currentQuantity = this.state.numberDeviceCurrent;
        currentQuantity = currentQuantity + 1;

        AsyncStorage.getItem(Config.keyStoreOrderDeviceOut, (err, res) => {
            if (!res) AsyncStorage.setItem(Config.keyStoreOrderDeviceOut, JSON.stringify([temp]));
            else {
                var items = JSON.parse(res);
                items.push(device);

                AsyncStorage.setItem(Config.keyStoreOrderDeviceOut, JSON.stringify(items));
            }
            Toast.show({
                text: 'Đã thêm binh ' + device.code,
                position: 'bottom',
                type: 'success',
                buttonText: 'Ẩn',
                duration: 3000
            });
            this.setState({numberDeviceCurrent: currentQuantity});
        });
    }

    _renderButton() {
        if (this.state.numberDeviceCurrent >= this.state.numberDeviceTotal) {
            return (
                <CardItem>
                    <TouchableOpacity onPress={() => Actions.bill()}>
                        <View style={styles.continueBtn}>
                            <Icon name='ios-paper'/>
                            <Text>{Config.deviceList}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.takePicture}>
                        <View style={styles.continueBtn}>
                            <Icon name='ios-skip-forward'/>
                            <Text>{Config.btnScanContinue}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Actions.home()}>
                        <View style={styles.camBtn}>
                            <Icon name='ios-close-circle'/>
                            <Text>{Config.btnCancel}</Text>
                        </View>
                    </TouchableOpacity>
                </CardItem>
            );
        } else {
            return (
                <CardItem>
                    <TouchableOpacity onPress={this._createOrder(this.state.customer_id)}>
                        <View style={styles.continueBtn}>
                            <Icon name='ios-send'/>
                            <Text>{Config.btnOrderOut}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Actions.home()}>
                        <View style={styles.camBtn}>
                            <Icon name='ios-close-circle'/>
                            <Text>{Config.btnCancel}</Text>
                        </View>
                    </TouchableOpacity>
                </CardItem>);
        }
    }

    _createOrder(customerId) {
        AsyncStorage.setItem(Config.keyStoreOrderDeviceOut, JSON.stringify([]));
    }

    render() {
        return (
            <View style={styles.container}>
                <Spinner
                    //visibility of Overlay Loading Spinner
                    visible={this.state.isLoading}
                    //Text with the Spinner
                    //textContent={'Đang đăng nhập ...'}
                    //Text style of the Spinner Text
                    textStyle={styles.spinnerTextStyle}
                />
                <RNCamera
                    ref={cam => {
                        this.camera = cam;
                    }}
                    style={styles.cam}
                    captureAudio={true}
                >
                </RNCamera>
                <View style={styles.bottomBar}>
                    <CardItem>
                        <Text style={{fontWeight: 'bold'}}><Icon name="ios-contact"
                                                                 style={styles.icon}/> {Config.orderCustomer}</Text>
                        <Text style={{fontWeight: 'bold', fontSize: 16}}> {this.state.customer_name} </Text>
                    </CardItem>
                    <CardItem>
                        <Text style={{fontWeight: 'bold'}}><Icon name="ios-contact"
                                                                 style={styles.icon}/> {Config.numberDeviceScanned}
                        </Text>
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: 16,
                            color: Config.errorColor
                        }}>  {this.state.numberDeviceCurrent}/{this.state.numberDeviceTotal} </Text>
                    </CardItem>
                    {this._renderButton()}
                </View>
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
        // height: 80,
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
    },
    spinnerTextStyle: {
        color: '#FFF',
        fontWeight: 'bold'
    },

    continueBtn: {
        borderRadius: 5,
        borderWidth: 1.3,
        borderColor: Config.mainColor,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
