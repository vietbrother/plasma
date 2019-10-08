import React, {Component} from "react";
import {
    AppRegistry,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Modal, Alert, AsyncStorage, ActivityIndicator, ScrollView
} from "react-native";
import {
    Button, Container, Icon, CardItem, Left, Right, Grid, Col, Toast, Footer, FooterTab, Item,
    Input,
    Header
} from 'native-base';

import {RNCamera} from 'react-native-camera';

import Config from "../../Config";
import {Actions} from 'react-native-router-flux';
import Spinner from 'react-native-loading-spinner-overlay';
import DeviceItem from "../Device/DeviceItem";
import Navbar from "../Navbar";
import Colors from "../../Colors";

export default class StockInList extends Component {

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
            deviceList: [],
            stockInType: '',
            title: '',

        }
    }

    componentDidMount(): void {
        this.setState({
            customer_id: this.props.customer_id,
            customer_name: this.props.customer_name,
            numberDeviceTotal: this.props.numberDeviceScan,
            stockInType: this.props.stockInType,
            title: this.props.title,
        });
    }

    _renderResult() {
        let items = [];
        for (var i = 0; i < this.state.products.length; i++) {
            var item = this.state.products[i];
            var key = new Date().valueOf();
            console.log(item);
            items.push(
                <View style={{
                    // flex: 1,
                    width: '100%', color: Config.mainColor, fontSize: 16,
                    borderBottomColor: Colors.navbarBackgroundColor, borderBottomWidth: 0.5,
                    paddingLeft: 10,
                    paddingTop: 10, paddingBottom: 10
                }}>
                    <DeviceItem key={key + '_' + i} device={item}></DeviceItem>
                    <CardItem>
                        <Left></Left>
                        <Right>
                            <Button transparent
                                    onPress={() => {
                                        this._addToOrder(item)
                                    }}>
                                <Icon name="ios-add-circle"></Icon>
                                <Text style={{color: Config.mainColor, marginLeft: 5}}>Thêm thiết bị</Text>
                            </Button>
                        </Right>
                    </CardItem>
                </View>
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
            global.odooAPI.connect(this._getResConnect.bind(this));

            var params = {
                // ids: [1, 2, 3, 4, 5],
                domain: [['code', 'like', this.state.searchText.toUpperCase()], ['stage', '=', Config.stage3BinhTon]],
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

        AsyncStorage.getItem('LIST_DEVICE_IN', (err, res) => {
            console.log(res);
            if (!res) AsyncStorage.setItem('LIST_DEVICE_IN', [device]);
            else {
                var items = JSON.parse(res);
                items.push(device);
                console.log("items : " + items);

                AsyncStorage.setItem('LIST_DEVICE_IN', JSON.stringify(items));

                // AsyncStorage.getItem('LIST_DEVICE_IN', (err, res) => {
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
        if (this.state.numberDeviceCurrent < 1) {
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

                    <Right>
                        <TouchableOpacity onPress={() => this._cancel()}>
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
                        this._updateEquipmentList()
                    }}>
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <Icon name='save' style={{color: 'green'}}/>
                            <Text>{Config.btnSave}</Text>
                        </View>
                    </TouchableOpacity>
                    <Right>
                        <TouchableOpacity onPress={() => {
                            this._cancel()
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
        AsyncStorage.getItem('LIST_DEVICE_IN', (err, res) => {
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
        // AsyncStorage.setItem('LIST_DEVICE_IN', JSON.stringify([]));
    }

    _actionChangeStage(id, deviceCode) {
        try {
            // Connect to Odoo
            global.odooAPI.connect(this._getResConnect.bind(this));
            var codeDevice = deviceCode;
            var params = {
                stage: Config.stage4BinhDangSuDung,
                warehouse: Config.warehouseKhoKhachHang,
                p_customer: this.state.customer_id
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
            global.odooAPI.connect(this._getResConnect.bind(this));

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
        this.setState({isLoading: false});
        if (err) {
            alert(err);
            return console.log(err);
        }
        console.log('_______response__create_________________');
        console.log(response);
        try {
            if (response) {
                alert(this.state.title + ' thành công ');
                AsyncStorage.setItem('LIST_DEVICE_IN', JSON.stringify([]));
                Actions.home();
            } else {
                alert(this.state.title + ' thất bại ');
            }
        } catch (e) {
            console.log(e);
            this.setState({isLoading: false});
        }
    }


    _billList() {
        AsyncStorage.getItem('LIST_DEVICE_IN', (err, res) => {
            console.log("res " + res);
            Actions.bill({lstDevice: res});
        });
    }

    _addDeviceCodeToList() {
        var device = this.state.searchText;
        if (device == null || device == "") {
            alert(Config.err_device_code_required);
            return;
        }
        if (device.length < 6 || device.length > 7 ) {
            alert(Config.err_device_code_not_valid);
            return;
        }

        var currentQuantity = this.state.numberDeviceCurrent;
        currentQuantity = currentQuantity + 1;

        AsyncStorage.getItem('LIST_DEVICE_IN', (err, res) => {
            console.log(res);
            if (!res) AsyncStorage.setItem('LIST_DEVICE_IN', [device]);
            else {
                var items = JSON.parse(res);
                items.push(device);
                console.log("items : " + items);

                AsyncStorage.setItem('LIST_DEVICE_IN', JSON.stringify(items));

                // AsyncStorage.getItem('LIST_DEVICE_IN', (err, res) => {
                //     console.log("res " + res);
                // });
            }
            Toast.show({
                text: 'Đã thêm binh ' + device,
                position: 'bottom',
                type: 'success',
                buttonText: 'Ẩn',
                duration: 3000
            });
            this.setState({numberDeviceCurrent: currentQuantity});
        });
    }

    async _updateEquipmentList() {
        this.setState({isLoading: true});
        AsyncStorage.getItem('LIST_DEVICE_IN', (err, res) => {
            if (!res)
                alert(Config.err_number_device_empty);
            else {
                var items = JSON.parse(res);
                console.log("items : " + items.toString());
                try {
                    let response = fetch(Config.postgre_api, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            lstCodeRequest: items.toString(),
                            stage: this.state.stockInType,
                            customerId: ''
                        })
                    });
                    var responseObj = response.json();
                    if (responseObj == 'ok') {
                        this._createOrderWithDeviceCode(items)
                    } else {
                        this.setState({isLoading: false});
                    }
                } catch (e) {
                    console.log(e);
                    alert(Config.err_device_save);
                    this.setState({isLoading: false});
                }
            }
        });
    }

    _createOrderWithDeviceCode(lstDeviceCode) {
        try {
            console.log(lstDeviceCode);
            var dateTime = new Date().toISOString();
            var dateStr = dateTime.split('T')[0].replace(/-/g, '').replace(/:/g, '')
            var dateTimeStr = dateTime.split('.')[0].replace('T', '').replace(/-/g, '').replace(/:/g, '');

            var orderCustomerId = this.state.customer_id;
            var orderType = Config.orderType4XuatChoKhach;
            var device_id = lstDeviceCode;
            var orderCode = dateTimeStr + '_Khong_xac_dinh';
            if (this.state.stockInType == '1') {
                orderCode = dateTimeStr + '_Nhap_vo';
            } else if (status == '2') {
                orderCode = dateTimeStr + '_Xuat_vo';
            } else if (status == '3') {
                orderCode = dateTimeStr + '_Nhap_khi';
            }
            //TYPE = [(0, 'Không xác định'), (1, 'Thu hồi'), (2, 'Xuất tái nạp'), (3, 'Nhập kho'), (4, 'Xuất cho khách')]


            // Connect to Odoo
            global.odooAPI.connect(this._getResConnect.bind(this));

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

    _cancel() {
        AsyncStorage.setItem('LIST_DEVICE_IN', JSON.stringify([]));
        Actions.home();
    }

    render() {
        var left = (
            <Left style={{flex: 1}}>
                <Button onPress={() => Actions.pop()} transparent>
                    <Icon name='ios-arrow-back'/>
                </Button>
            </Left>
        );
        var right = (
            <Right style={{flex: 1}}>
            </Right>
        );
        return (
            <Container style={{backgroundColor: '#fdfdfd'}}>
                <Navbar left={left} right={right} title={this.state.title}/>
                <Spinner
                    //visibility of Overlay Loading Spinner
                    visible={this.state.isLoading}
                    //Text with the Spinner
                    //textContent={'Đang đăng nhập ...'}
                    //Text style of the Spinner Text
                    textStyle={styles.spinnerTextStyle}
                />
                <View style={styles.topBar}>
                    <Item style={{marginLeft: 5, marginRight: 5}}>
                        <Input
                            placeholder="Nhập mã bình..."
                            // value={this.state.searchText}
                            onChangeText={(text) => this.setState({searchText: text})}
                            // onSubmitEditing={() => this.search()}
                            onSubmitEditing={() => this._addDeviceCodeToList()}
                            // onSubmitEditing={() => this.search(this.state.searchText)}
                            // style={{marginTop: 9}}
                        />
                        <Icon name="ios-search" style={Config.mainColor}
                              onPress={() => this._addDeviceCodeToList()}/>
                    </Item>
                </View>
                {/*<ScrollView contentContainerStyle={{flexGrow: 1}}>*/}
                {/*<ActivityIndicator*/}
                {/*animating={this.state.isSearching}*/}
                {/*color={Config.mainColor}*/}
                {/*size="large"*/}
                {/*/>*/}
                {/*{this._renderResult()}*/}
                {/*</ScrollView>*/}
                <View style={styles.bottomBar}>
                    <CardItem>
                        <Icon name="ios-calculator" style={styles.icon}/>
                        <Text style={{fontWeight: '400'}}>{Config.numberDeviceScanned} : </Text>
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: 16,
                            color: Config.errorColor
                        }}>  {this.state.numberDeviceCurrent} </Text>
                    </CardItem>
                    {this._renderButton()}
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
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
        // alignSelf: 'flex-end',
        backgroundColor: "white",
        // flexDirection: 'row',
        // height: 80,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        color: Config.mainColor
    },
    topBar: {
        // alignSelf: 'flex-start',
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
