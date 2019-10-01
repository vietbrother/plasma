import React, {Component} from "react";
import {
    AppRegistry,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Modal, Alert, AsyncStorage
} from "react-native";
import {Button, Container, Icon, CardItem, Left, Right, Grid, Col, Toast, Footer, FooterTab} from 'native-base';

import {RNCamera} from 'react-native-camera';

import Config from "../../Config";
import {Actions} from 'react-native-router-flux';
import Spinner from 'react-native-loading-spinner-overlay';
import ImageResizer from "react-native-image-resizer";
import RNFS from "react-native-fs";
import SearchDeviceItem from "../SearchDevice/SearchDeviceItem";

export default class ManualScannerList extends Component {

    constructor() {
        super()
        this.state = {
            isLoading: false,
            isSearching: false,
            extractedText: '',
            imgPath: '',
            products: [],
            textDetect: '',
            responseUpdate: '',
            newStage: 0,
            oldStage: '',
            searchText: '',

            customer_id: '',
            customer_name: '',
            numberDeviceCurrent: 0,
            numberDeviceTotal: 0,
            deviceList: []
        }
    }

    componentDidMount(): void {
        this.setState({
            customer_id: this.props.customer_id,
            customer_name: this.props.customer_name,
            numberDeviceTotal: this.props.numberDeviceScan,
        });
    }

    _renderResult() {
        let items = [];
        for (var i = 0; i < this.state.products.length; i++) {
            var item = this.state.products[i];
            var key = new Date().valueOf();
            console.log(item);
            items.push(
                <SearchDeviceItem key={key + '_' + i} device={item}></SearchDeviceItem>
            );
            items.push(
                <CardItem>
                    <Right>
                        <Button style={styles.buttonChangeState}
                                onPress={() => {this._addToOrder(item)}} >
                            <Icon name="ios-add-circle"></Icon>
                            <Text style={{color: Config.mainColor, marginLeft: 5}}>Thêm thiết bị</Text>
                        </Button>
                    </Right>
                </CardItem>
            );
        }
        return items;
    }

    search() {
        console.log('devices-----------------search');
        this.setState({isSearching: true});
        let items = [];
        try {
            // Connect to Odoo
            global.odooAPI.connect(function (err) {
                if (err) {
                    this.setState({isSearching: false});
                    console.log('--------------connect error');
                    alert(Config.err_connect)
                    return console.log(err);
                }
            });

            var params = {
                // ids: [1, 2, 3, 4, 5],
                domain: [['code', 'like', this.state.searchText.toUpperCase()]],
                fields: ['id', 'code', 'stage', 'warehouse', 'p_customer', 'description'],
                order: 'id',
                limit: 10,
                offset: 0,
            }; //params
            global.odooAPI.search_read('p.equipment', params, this._getData.bind(this)); //search_read
        } catch (e) {
            console.log(e);
            this.setState({isSearching: false});
        }
    }

    _getData(err, products) {
        this.setState({isSearching: false});
        if (err) {
            alert(err);
            return console.log(err);
        }
        console.log(products);
        console.log('__________________________');
        this.setState({products: products});
    }



    _addToOrder(device) {
        var temp = [];
        temp.push(device);
        var currentQuantity = this.state.numberDeviceCurrent;
        currentQuantity = currentQuantity + 1;

        AsyncStorage.getItem('ORDER_DEVICE_OUT', (err, res) => {
            console.log(res);
            if (!res) AsyncStorage.setItem('ORDER_DEVICE_OUT', [device]);
            else {
                var items = JSON.parse(res);
                items.push(device);
                console.log("items : " + items);

                AsyncStorage.setItem('ORDER_DEVICE_OUT', JSON.stringify(items));

                // AsyncStorage.getItem('ORDER_DEVICE_OUT', (err, res) => {
                //     console.log("res " + res);
                // });
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
        if (this.state.numberDeviceCurrent < this.state.numberDeviceTotal) {
            return (
                <CardItem>
                    <Left>
                        {/*<TouchableOpacity onPress={() => Actions.bill()}>*/}
                        <TouchableOpacity onPress={() => {
                            this._billList()
                        }}>
                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                <Icon name='ios-paper' style={styles.btnExport}/>
                                <Text>{Config.deviceListTitle}</Text>
                            </View>
                        </TouchableOpacity>
                    </Left>

                    <TouchableOpacity onPress={this.takePicture.bind(this)}>
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            {this.state.numberDeviceCurrent == 0 ?
                                <Icon name='ios-camera' style={styles.btnExport}/> :
                                <Icon name='ios-skip-forward' style={styles.btnExport}/>}
                            {this.state.numberDeviceCurrent == 0 ?
                                <Text>{Config.btnScan}</Text> :
                                <Text>{Config.btnScanContinue}</Text>}

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this._getDeviceInfo('HN05059')
                    }}>
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <Text>test</Text>
                        </View>
                    </TouchableOpacity>
                    <Right>
                        <TouchableOpacity onPress={() => Actions.stockOutMultiple()}>
                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                <Icon name='ios-close-circle'/>
                                <Text>{Config.btnCancel}</Text>
                            </View>
                        </TouchableOpacity>
                    </Right>

                </CardItem>

            );
        } else {
            return (
                <CardItem>
                    <Left>
                        <TouchableOpacity onPress={() => {
                            this._billList()
                        }}>
                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                <Icon name='ios-paper' style={styles.btnExport}/>
                                <Text>{Config.deviceListTitle}</Text>
                            </View>
                        </TouchableOpacity>
                    </Left>
                    <TouchableOpacity onPress={() => {
                        this._actionCreateOrder()
                    }}>
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <Icon name='ios-send' style={{color: 'green'}}/>
                            <Text>{Config.btnOrderOut}</Text>
                        </View>
                    </TouchableOpacity>
                    <Right>
                        <TouchableOpacity onPress={() => {
                            Actions.stockOutMultiple()
                        }}>
                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                <Icon name='ios-close-circle'/>
                                <Text>{Config.btnCancel}</Text>
                            </View>
                        </TouchableOpacity>
                    </Right>
                </CardItem>
            );
        }
    }

    _actionCreateOrder() {
        AsyncStorage.getItem('ORDER_DEVICE_OUT', (err, res) => {
            console.log("_____res " + res);
            if (res) {
                var items = JSON.parse(res);
                var lstDeviceId = [];
                for (var i = 0; i < items.length; i++) {
                    lstDeviceId.push(items[i].id);
                    this._actionChangeStage(items[i].id, items[i].code);
                }
                this._createOrder(lstDeviceId);
            }
        });
        // AsyncStorage.setItem('ORDER_DEVICE_OUT', JSON.stringify([]));
    }

    _actionChangeStage(id, deviceCode) {
        try {
            // Connect to Odoo
            global.odooAPI.connect(this._getResConnect.bind(this));
            var codeDevice = deviceCode;
            var params = {
                stage: Config.stage4BinhDangSuDung
            }; //params
            global.odooAPI.update('p.equipment', id, params, this._getResUpdate.bind(this)); //update stage
        } catch (e) {
            console.log(e);
            alert('Chuyển trạng thái bình ' + deviceCode + ' thất bại! ');
            this.setState({isLoading: false});
        }
    }

    _getResConnect(err) {
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
            this.setState({isLoading: false});
        } catch (e) {
            console.log(e);
            alert('Chuyển trạng thái bình thất bại! ');
            this.setState({isLoading: false});
        }
    }


    _createOrder(lstDeviceId) {
        try {
            console.log(lstDeviceId);
            var dateTime = new Date().toISOString();
            var dateStr = dateTime.split('T')[0].replace(/-/g, '').replace(/:/g, '')
            var dateTimeStr = dateTime.split('.')[0].replace('T', '').replace(/-/g, '').replace(/:/g, '');

            var orderCustomerId = this.state.customer_id;
            var orderType = Config.orderType4XuatChoKhach;
            var device_id = lstDeviceId;
            var orderCode = dateTimeStr + '_Xuat_hang_loat_cho_khach';
            //TYPE = [(0, 'Không xác định'), (1, 'Thu hồi'), (2, 'Xuất tái nạp'), (3, 'Nhập kho'), (4, 'Xuất cho khách')]


            // Connect to Odoo
            global.odooAPI.connect(function (err) {
                if (err) {
                    console.log('--------------connect error');
                    this.setState({isLoading: false});
                    return console.log(err);
                }
            });

            var params = {
                p_equipments: [[6, 0, device_id]],
                type: orderType,
                code: orderCode,
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
        if (err) {
            alert(err);
            return console.log(err);
        }
        console.log('_______response__create_________________');
        console.log(response);
        try {
            this.setState({isLoading: false});
            if (response) {
                alert('Xuất cho khách thành công ');
                Actions.pop();
            } else {
                alert('Xuất cho khách thất bại ');
            }
        } catch (e) {
            console.log(e);
            this.setState({isLoading: false});
        }
    }


    _billList() {
        AsyncStorage.getItem('ORDER_DEVICE_OUT', (err, res) => {
            console.log("res " + res);
            Actions.bill({lstDevice: res});
        });
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
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingLeft: 10,
                    paddingRight: 10
                }}>
                    <Item>
                        <Input
                            placeholder="Tìm kiếm bình..."
                            // value={this.state.searchText}
                            onChangeText={(text) => this.setState({searchText: text})}
                            // onSubmitEditing={() => this.search(this.state.searchText)}
                            // style={{marginTop: 9}}
                        />
                        <Icon name="ios-search" style={Config.mainColor}
                              onPress={() => this.search()}/>
                    </Item>
                    <ActivityIndicator
                        animating={this.state.isSearching}
                        color={Config.mainColor}
                        size="large"
                    />
                    {this._renderResult()}
                </View>
                <Footer style={{
                    backgroundColor: 'white'
                }}>
                    <FooterTab style={{backgroundColor: 'white', borderTop: 1, color: Config.mainColor, borderTopColor: 'grey', marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5}}>
                        <CardItem>
                            <Icon name="ios-contact" style={styles.icon}/>
                            <Text style={{fontWeight: '400'}}>{Config.orderCustomer} : </Text>
                            <Text style={{fontWeight: 'bold', fontSize: 16}}> {this.state.customer_name} </Text>
                        </CardItem>
                        <CardItem>
                            <Icon name="ios-calculator" style={styles.icon}/>
                            <Text style={{fontWeight: '400'}}>{Config.numberDeviceScanned} : </Text>
                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: 16,
                                color: Config.errorColor
                            }}>  {this.state.numberDeviceCurrent}/{this.state.numberDeviceTotal} </Text>
                        </CardItem>
                        {this._renderButton()}
                    </FooterTab>
                </Footer>
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
        height: Dimensions.get("window").width,
        width: Dimensions.get("window").width
    },

    bottomBar: {
        alignSelf: 'flex-end',
        backgroundColor: "white",
        // flexDirection: 'row',
        // height: 80,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        color: Config.mainColor
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

    continueBtnView: {
        borderRadius: 5,
        borderWidth: 0.5,
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
    },
    continueBtn: {
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnExport: {
        color: 'green'
    },
    btnBar: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        color: Config.mainColor
    },
    buttonChangeState: {
        backgroundColor: 'white',
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: Config.mainColor
    }
});
