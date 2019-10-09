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

export default class StockInOutList extends Component {

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
            customer_id: this.props.customer_id == null || this.props.customer_id == undefined ? '' : this.props.customer_id,
            customer_name: this.props.customer_name,
            numberDeviceTotal: this.props.numberDeviceScan,
            stockInType: this.props.stockInType,
            title: this.props.title,
        });
    }

    _renderCustomerName() {
        if (this.state.customer_name != null && this.state.customer_name != '' && this.state.customer_name != undefined) {
            return (
                <CardItem>
                    <Icon name="ios-contact" style={styles.icon}/>
                    <Text style={{fontWeight: '400'}}>{Config.orderCustomer} : </Text>
                    <Text style={{fontWeight: 'bold', fontSize: 16}}> {this.state.customer_name} </Text>
                </CardItem>
            );
        }
    }

    _renderNumberDevice() {
        if (this.state.stockInType == Config.stage4BinhDangSuDung) {
            return (
                <CardItem>
                    <Icon name="ios-calculator" style={styles.icon}/>
                    <Text style={{fontWeight: '400'}}>{Config.numberDeviceScanned} : </Text>
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 16,
                        color: Config.errorColor
                    }}>  {this.state.numberDeviceCurrent}/{this.state.numberDeviceTotal} </Text>
                </CardItem>
            );
        } else {
            return (
                <CardItem>
                    <Icon name="ios-calculator" style={styles.icon}/>
                    <Text style={{fontWeight: '400'}}>{Config.numberDeviceInputed} : </Text>
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 16,
                        color: Config.errorColor
                    }}>  {this.state.numberDeviceCurrent} </Text>
                </CardItem>
            );
        }
    }

    _renderButton() {
        if (this.state.stockInType == Config.stage4BinhDangSuDung) {
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
                                <Icon name='ios-send' style={{color: 'green'}}/>
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
        } else {
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
                                <Icon name='ios-send' style={{color: 'green'}}/>
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

    }


    _billList() {
        AsyncStorage.getItem('LIST_DEVICE_IN_OUT', (err, res) => {
            console.log("res " + res);
            Actions.billList({lstDevice: res});
        });
    }

    _addDeviceCodeToList() {
        var device = this.state.searchText;
        if (device == null || device == "") {
            alert(Config.err_device_code_required);
            return;
        }
        if (device.length < 6 || device.length > 7) {
            alert(Config.err_device_code_not_valid);
            return;
        }

        var currentQuantity = this.state.numberDeviceCurrent;
        currentQuantity = currentQuantity + 1;

        if (this.state.numberDeviceTotal != undefined && this.state.numberDeviceTotal != null
            && currentQuantity > this.state.numberDeviceTotal) {
            alert(Config.err_number_device_over);
            return;
        }

        AsyncStorage.getItem('LIST_DEVICE_IN_OUT', (err, res) => {
            console.log(res);
            if (!res) AsyncStorage.setItem('LIST_DEVICE_IN_OUT', [device]);
            else {
                var items = JSON.parse(res);
                if (items.includes(device)) {
                    alert(Config.err_device_code_exist);
                    return;
                }
                items.push(device);
                console.log("items : " + items);

                AsyncStorage.setItem('LIST_DEVICE_IN_OUT', JSON.stringify(items));

                // AsyncStorage.getItem('LIST_DEVICE_IN_OUT', (err, res) => {
                //     console.log("res " + res);
                // });
            }
            this.setState({searchText: ''});
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
        AsyncStorage.getItem('LIST_DEVICE_IN_OUT', (err, res) => {
            if (!res)
                alert(Config.err_number_device_empty);
            else {
                var items = JSON.parse(res);
                console.log("items : " + items.toString());
                this._fetchApi(items);
            }
        });
    }

    async _fetchApi(items) {
        try {
            let formdata = new FormData();
            formdata.append('lstCodeRequest', items.toString());
            formdata.append('stage', this.state.stockInType);
            formdata.append('customerId', this.state.customer_id);

            //var fetchData = await fetch(`http://103.94.16.226:8086/api/equipment/save`, {
            var fetchData = await fetch(Config.postgre_api, {
                method: 'POST',
                body: formdata
            });
            console.log('========================');
            var responseObj = await fetchData.json();
            console.log(responseObj);
            if (responseObj.errorCode == 'ok') {
                var arrId = responseObj.lstId;
                if (arrId == null || arrId == '' || arrId == undefined || arrId.length < 1) {
                    alert(Config.err_device_save);
                    this.setState({isLoading: false});
                    return;
                }
                arrId = arrId.substring(0, arrId.length - 1);
                arrId = arrId.split(";");

                var arrIdNumber = arrId.map(function (item) {
                    return parseInt(item, 10);
                });
                this._createOrderWithDeviceCode(arrIdNumber);
            } else {
                alert(Config.err_device_save);
                this.setState({isLoading: false});
            }
        } catch (e) {
            console.log(e);
            alert(Config.err_device_save);
            this.setState({isLoading: false});
        }
    }

    _createOrderWithDeviceCode(lstDeviceId) {
        try {
            console.log(lstDeviceId);
            var dateTime = new Date().toISOString();
            var dateStr = dateTime.split('T')[0].replace(/-/g, '').replace(/:/g, '')
            var dateTimeStr = dateTime.split('.')[0].replace('T', '').replace(/-/g, '').replace(/:/g, '');

            var orderCustomerId = this.state.customer_id;
            var orderType = this.state.stockInType;
            var device_code = lstDeviceId;
            var orderCode = dateTimeStr + '_Khong_xac_dinh';
            if (this.state.stockInType == '1') {
                orderCode = dateTimeStr + '_Nhap_vo';
            } else if (this.state.stockInType == '2') {
                orderCode = dateTimeStr + '_Xuat_vo';
            } else if (this.state.stockInType == '3') {
                orderCode = dateTimeStr + '_Nhap_khi';
            } else if (this.state.stockInType == '4') {
                orderCode = dateTimeStr + '_Xuat_khi';
            }
            //TYPE = [(0, 'Không xác định'), (1, 'Thu hồi'), (2, 'Xuất tái nạp'), (3, 'Nhập kho'), (4, 'Xuất cho khách')]


            // Connect to Odoo
            global.odooAPI.connect(this._getResConnect.bind(this));

            var params = {
                p_equipments: [[6, 0, device_code]],
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

    _getResConnect(err) {
        if (err) {
            console.log('--------------connect error');
            this.setState({isLoading: false});
            alert(Config.err_connect);
            return console.log(err);
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
                AsyncStorage.setItem('LIST_DEVICE_IN_OUT', JSON.stringify([]));
                Actions.home();
            } else {
                alert(this.state.title + ' thất bại ');
            }
        } catch (e) {
            console.log(e);
            this.setState({isLoading: false});
        }
    }


    _cancel() {
        AsyncStorage.setItem('LIST_DEVICE_IN_OUT', JSON.stringify([]));
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
                            value={this.state.searchText}
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
                <View style={styles.bottomBar}>
                    {this._renderCustomerName()}
                    {this._renderNumberDevice()}
                    {/*<CardItem>*/}
                    {/*<Icon name="ios-calculator" style={styles.icon}/>*/}
                    {/*<Text style={{fontWeight: '400'}}>{Config.numberDeviceInputed} : </Text>*/}
                    {/*<Text style={{*/}
                    {/*fontWeight: 'bold',*/}
                    {/*fontSize: 16,*/}
                    {/*color: Config.errorColor*/}
                    {/*}}>  {this.state.numberDeviceCurrent} </Text>*/}
                    {/*</CardItem>*/}
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
