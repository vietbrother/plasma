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
import {Button, Container, Icon} from 'native-base';

// import Camera from "react-native-camera";
import {RNCamera} from 'react-native-camera';

import Config from "../../Config";
import {Actions} from 'react-native-router-flux';
import Spinner from 'react-native-loading-spinner-overlay';
import ImageResizer from "react-native-image-resizer";
import RNFS from "react-native-fs";
// import FlowItem from "../Flow/FlowItem";


export default class CameraScanner extends Component {

    constructor() {
        super()
        this.state = {
            isLoading: false,
            extractedText: '',
            imgPath: '',
            renderModal: false,
            products: [],
            textDetect: '',
            responseUpdate: '',
            newStage: 0,
            oldStage: '',
        }
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

        //from camera /Users/jbecks/Library/Developer/CoreSimulator/Devices/D9FE59D4-5706-4B0B-98D7-9D7B9519D18A/data/Containers/Data/Application/CCDC4308-F7FA-443A-B9B1-0DEBBDF93C01/Documents/24D6D353-B8FA-414F-ADEC-92B672FD056D.jpg
        //from cameraRoll assets-library://asset/asset.JPG?id=729F50DA-9627-42A9-802D-69B22C9EECD2&ext=JPG
        //const imgPath = this.props.captureData.uri;
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
        if (err) {
            alert(err);
            this.setState({isLoading: false});
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
            var newStage = this._switchStage(products[0].stage);
            if (newStage == '4') {//chuyen trang thai tu binh ton sang xuat cho khach
                this.setState({isLoading: false});
                Alert.alert(
                    '',
                    'Xuất bình ' + this.state.textDetect + ' cho khách', // <- this part is optional, you can pass an empty string
                    [
                        {
                            text: 'Xuất cho khách',
                            onPress: () => Actions.stockOut({
                                textDetect: this.state.textDetect,
                                deviceInfo: products[0]
                            })
                        },
                        {
                            text: 'Hủy',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },
                    ],
                    {cancelable: true},
                );
                return;
            }
            this.setState({newStage: newStage, oldStage: products[0].stage, products: products});
            this._actionChangeStage(products[0].id, newStage);
        } catch (e) {
            console.log(e);
            alert('Lấy thông tin bình ' + this.state.textDetect + ' thất bại! ');
            this.setState({isLoading: false, products: []});
        }
    }

    _actionChangeStage(id, newState) {
        try {

            console.log('--------------id ' + id + "---newState  " + newState);
            // Connect to Odoo
            // global.odooAPI.connect(function (err) {
            //     if (err) {
            //         console.log('--------------connect error');
            //         this.setState({isLoading: false});
            //         return console.log(err);
            //     }
            // });
            global.odooAPI.connect(this._getResConnect.bind(this));

            var codeDevice = this.state.textDetect;
            var params = {
                stage: newState
            }; //params
            global.odooAPI.update('p.equipment', id, params, this._getResUpdate.bind(this)); //update stage
        } catch (e) {
            console.log(e);
            alert('Chuyển trạng thái bình ' + this.state.textDetect + ' thất bại! ');
            this.setState({isLoading: false});
        }
    }
    _getResConnect(err){
        if (err) {
            console.log('--------------connect error');
            this.setState({isLoading: false});
            alert(Config.err_connect);
            return console.log(err);
        }
    }

    _getResUpdate(err, response) {
        if (err) {
            this.setState({isLoading: false});
            alert(err);
            return console.log(err);
        }
        console.log('_______response___________________');
        console.log(response);
        try {
            this.setState({responseUpdate: response});
            /*
            if (response) {
                alert('Chuyển trạng thái mã bình ' + this.state.textDetect + ' từ '
                    + this._renderStatus(this.state.oldStage)
                + ' sang ' + this._renderStatus(this.state.newStage));
            }
            this.setState({isLoading: false});
            */
            this._createOrder('0');
        } catch (e) {
            console.log(e);
            alert('Chuyển trạng thái mã bình ' + this.state.textDetect + ' thất bại! ');
            this.setState({isLoading: false});
        }
    }


    _switchStage(status) {
        if (status == '0') {
            return '1';
        } else if (status == '4') {
            return '1';
        } else if (status == '1') {
            return '2';
        } else if (status == '2') {
            return '3';
        } else if (status == '3') {
            return '4';
        } else {
            return '0';
        }
    }

    _renderStatus(status) {
        if (status == '0') {
            return Config.stageName0KhongXacDinh;
        } else if (status == '4') {
            return Config.stageName4BinhDangSuDung;
        } else if (status == '1') {
            return Config.stageName1Vo;
        } else if (status == '2') {
            return Config.stageName2TaiNap;
        } else if (status == '3') {
            return Config.stageName3BinhTon;
        } else {
            return {status};
        }
    }

    /**
     * Create order
     * */
    _createOrder(customerId) {
        try {
            var oldStage = this.state.oldStage;
            var dateTime = new Date().toISOString();
            var dateStr = dateTime.split('T')[0].replace(/-/g, '').replace(/:/g, '')
            var dateTimeStr = dateTime.split('.')[0].replace('T', '_').replace(/-/g, '').replace(/:/g, '');

            var orderCode = '';
            var orderCustomerId = '';
            var orderType = '';
            var device_id = this.state.products[0].id;
            var device_code = this.state.products[0].code;
            //TYPE = [(0, 'Không xác định'), (1, 'Thu hồi'), (2, 'Xuất tái nạp'), (3, 'Nhập kho'), (4, 'Xuất cho khách')]
            if (oldStage == '0') {
                orderCode = dateTimeStr + 'Thu_hoi_' + device_code;
                orderType = Config.orderType1ThuHoi;
                orderCustomerId = '1';// cong ty
            } else if (oldStage == '4') {
                orderCode = dateTimeStr + 'Thu_hoi_' + device_code;
                orderType = Config.orderType1ThuHoi;
                orderCustomerId = '1';// cong ty
            } else if (oldStage == '1') {
                orderCode = dateTimeStr + 'Xuat_tai_nap_' + device_code;
                orderType = Config.orderType2XuatTaiNap;
                orderCustomerId = '2';// nha may
            } else if (oldStage == '2') {
                orderCode = dateTimeStr + 'Nhap_kho_' + device_code;
                orderType = Config.orderType3NhapKho;
                orderCustomerId = '1';// cong ty
            } else if (oldStage == '3') {
                orderCode = dateTimeStr + 'Xuat_cho_khach_' + device_code;
                orderType = Config.orderType4XuatChoKhach;
                orderCustomerId = customerId;// khach hang
            } else {
                alert('Trạng thái thiết bị không đúng')
                return;
            }

            // Connect to Odoo
            global.odooAPI.connect(function (err) {
                if (err) {
                    console.log('--------------connect error');
                    this.setState({isLoading: false});
                    return console.log(err);
                }
            });
            var params = {
                p_equipments: [(6, 0, device_id)],
                code: orderCode,
                type: orderType,
                p_customer: orderCustomerId
            }; //params
            global.odooAPI.create('p.order', params, this._getResCreateOrder.bind(this)); //update stage

        } catch (e) {
            console.log(e);
            Alert.alert(
                '',
                'Chuyển trạng thái thành công! Lỗi khi tạo đơn hàng!', // <- this part is optional, you can pass an empty string
                [
                    {text: 'Đóng', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false},
            );
            this.setState({isLoading: false});
        }
    }

    _getResCreateOrder(err, response) {
        this.setState({isLoading: false});
        if (err) {
            alert(err);
            return console.log(err);
        }
        console.log('_______response__create_________________');
        console.log(response);
        try {
            if (response != null) {
                alert('Chuyển trạng thái mã bình ' + this.state.textDetect + ' từ '
                    + this._renderStatus(this.state.oldStage)
                    + ' sang ' + this._renderStatus(this.state.newStage));
            } else {
                alert(Config.err_order_add);
            }
        } catch (e) {
            console.log(e);
            this.setState({isLoading: false});
            Alert.alert(
                '',
                'Chuyển trạng thái thành công! Lỗi khi tạo đơn hàng!', // <- this part is optional, you can pass an empty string
                [
                    {text: 'Đóng', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false},
            );
        }
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
                    <View style={styles.bottomBar}>
                        <TouchableOpacity onPress={this.takePicture}>
                            <View style={styles.camBtn}>
                                <Icon name='ios-camera'/>
                                {/*<Text>{Config.btnCamera}</Text>*/}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Actions.pop()}>
                            <View style={styles.camBtn}>
                                <Text>Dừng</Text>
                            </View>
                        </TouchableOpacity>
                        {/*<TouchableOpacity onPress={() => {*/}
                        {/*// Actions.flowItem({textDetect: 'HN05059', capturePhotoPath: ''});*/}
                        {/*// this.setState({renderModal: true, extractedText: 'HN05059'});*/}
                        {/*this._getDeviceInfo('HN05059');*/}
                        {/*}}>*/}
                        {/*<View style={styles.camBtn}>*/}
                        {/*<Text>_Test_</Text>*/}
                        {/*</View>*/}
                        {/*</TouchableOpacity>*/}
                    </View>
                </RNCamera>
                {/*{this._renderModal()}*/}
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
    },
    spinnerTextStyle: {
        color: '#FFF',
        fontWeight: 'bold'
    },
});
