/**
 * This is the Main file
 **/

// React native and others libraries imports
import React, {Component} from 'react';
import {Image, Dimensions, TouchableWithoutFeedback, AsyncStorage, Alert} from 'react-native';
import {
    View,
    Container,
    Content,
    Button,
    Left,
    Right,
    Icon,
    Picker,
    Item,
    Grid,
    Col,
    Toast,
    Text as NBText,
    List, ListItem,
    Card, CardItem,
    DatePicker,
    Body, Input
} from 'native-base';
import {Actions} from 'react-native-router-flux';
import Carousel, {Pagination} from 'react-native-snap-carousel';

// Our custom files and classes import
import Config from '../../Config';
import Text from '../../component/Text';
import Navbar from '../../component/Navbar';
import Spinner from 'react-native-loading-spinner-overlay';


export default class StockOut extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            errorText: '',
            isLoading: false,

            textDetect: '',
            code: '',
            deviceId: '',
            stateName: '',
            warehouse: '',
            createDate: new Date(),
            customer_id: '',
            deviceInfo: {},
            customers: [],
            newStage: 0,
            oldStage: '',
        };
    }

    componentWillMount() {
        //+) Trạng thái: STAGE = [(0, 'Không xác định'), (1, 'Vỏ'), (2, 'Tái nạp'), (3, 'Bình tồn'), (4, 'Bình đang sử dụng')]
        //+) Kho: WAREHOUSE = [(0, 'Không xác định'), (1, 'Kho Công ty'), (2, 'Kho Nhà máy'), (3, 'Kho Khách hàng')]
        this.setState({textDetect: this.props.textDetect, code: this.props.textDetect});
        this.setState({stateName: '3', warehouse: '1'});
        this.setState({deviceInfo: this.props.deviceInfo});
        this.setState({deviceId: this.state.deviceInfo.id});
        console.log(this.props.deviceInfo);

        try {
            this.setState({isLoading: true});
            // Connect to Odoo
            // global.odooAPI.connect(function (err) {
            //     if (err) {
            //         this.setState({isLoading: false});
            //         console.log('--------------connect error');
            //         return console.log(err);
            //     }
            // });
            global.odooAPI.connect(this._resConnect.bind(this));

            var params = {
                domain: [],
                fields: ['id', 'name', 'address'],
                order: 'name',
                // limit: 15,
                offset: 0,
            }; //params
            global.odooAPI.search_read('p.customer', params, this._getResSearch.bind(this)); //search_read
        } catch (e) {
            console.log(e);
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
                alert('Không tìm thấy thông tin khách hàng');
                this.setState({isLoading: false});
                return;
            }
            this.setState({customer_id: products[0].id});
            this.setState({isLoading: false, customers: products});
        } catch (e) {
            console.log(e);
            this.setState({isLoading: false, customers: []});
        }
    }


    onValueChangeCustomer(value: string) {
        this.setState({
            customer_id: value
        });
        console.log(this.state.customer_id);
    }

    renderListCustomer() {
        let cat = [];
        var lstCustomer = this.state.customers;
        for (var i = 0; i < lstCustomer.length; i++) {
            cat.push(
                <Picker.Item key={new Date()} label={lstCustomer[i].name} value={lstCustomer[i].id}/>
            );
        }
        return cat;
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
                {/*<Button onPress={() => Actions.search()} transparent>*/}
                {/*<Icon name='ios-search-outline'/>*/}
                {/*</Button>*/}
                {/*<Button onPress={() => Actions.cart()} transparent>*/}
                {/*<Icon name='ios-cart'/>*/}
                {/*</Button>*/}
            </Right>
        );
        return (
            <Container style={{backgroundColor: '#fdfdfd'}}>
                <Spinner
                    //visibility of Overlay Loading Spinner
                    visible={this.state.isLoading}
                    //Text with the Spinner
                    //textContent={'Đang đăng nhập ...'}
                    //Text style of the Spinner Text
                    textStyle={styles.spinnerTextStyle}
                />
                <Navbar left={left} right={right} title="Xuất bình"/>
                <Content contentContainerStyle={{
                    paddingHorizontal: 10,
                    backgroundColor: '#f3f9ff'
                }}>
                    <Card transparent>
                        <CardItem header bordered>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Xuất thiết bị cho khách</Text>
                        </CardItem>
                        <CardItem>
                            <Body>
                            <Text style={{fontSize: 16}}>Mã nhận diện
                                : <Text style={{fontSize: 18, fontWeight: 'bold'}}>{this.state.textDetect}</Text>
                            </Text>
                            </Body>
                        </CardItem>
                        {/*<CardItem>*/}
                        {/*<Body>*/}
                        {/*<Text style={{fontSize: 18, fontWeight: 'bold'}}>Mã thiết bị : </Text>*/}
                        {/*<Input*/}
                        {/*placeholder={this.state.code}*/}
                        {/*onChangeText={(text) => this.setState({code: text})}*/}
                        {/*// onSubmitEditing={() => this.search(this.state.searchText)}*/}
                        {/*// style={{marginTop: 9}}*/}
                        {/*/>*/}
                        {/*</Body>*/}
                        {/*</CardItem>*/}
                        {/*<CardItem>*/}
                        {/*<Body>*/}
                        {/*<Text style={{fontSize: 18, fontWeight: 'bold'}}>Trạng thái : </Text>*/}
                        {/*<Picker*/}
                        {/*note*/}
                        {/*mode="dropdown"*/}
                        {/*style={{width: 120}}*/}
                        {/*selectedValue={this.state.stateName}*/}
                        {/*// onValueChange={this.onValueChangeStateName.bind(this)}*/}
                        {/*>*/}
                        {/*<Picker.Item label="Bình tồn" value="3"/>*/}
                        {/*</Picker>*/}
                        {/*</Body>*/}
                        {/*</CardItem>*/}
                        {/*<CardItem>*/}
                        {/*<Body>*/}
                        {/*<Text style={{fontSize: 18, fontWeight: 'bold'}}>Kho : </Text>*/}
                        {/*<Picker*/}
                        {/*note*/}
                        {/*mode="dropdown"*/}
                        {/*style={{width: 120}}*/}
                        {/*selectedValue={this.state.warehouse}*/}
                        {/*// onValueChange={this.onValueChangeWarehouse.bind(this)}*/}
                        {/*>*/}
                        {/*/!*<Picker.Item label="Không xác định" value="0"/>*!/*/}
                        {/*<Picker.Item label="Kho công ty" value="1"/>*/}
                        {/*/!*<Picker.Item label="Kho nhà máy" value="2"/>*!/*/}
                        {/*/!*<Picker.Item label="Kho khách hàng" value="3"/>*!/*/}
                        {/*</Picker>*/}
                        {/*</Body>*/}
                        {/*</CardItem>*/}
                        <CardItem>
                            <Body>
                            <Text style={{fontSize: 16, fontWeight: 'bold'}}>Khách hàng : </Text>
                            <Picker
                                note
                                mode="dropdown"
                                style={{width: '100%'}}
                                selectedValue={this.state.customer_id}
                                onValueChange={this.onValueChangeCustomer.bind(this)}
                            >
                                {this.renderListCustomer()}
                            </Picker>
                            </Body>
                        </CardItem>


                        {this.state.hasError ? <Text style={{
                            color: Config.errorColor,
                            textAlign: 'center',
                            marginTop: 10
                        }}>{this.state.errorText}</Text> : null}

                        <CardItem>
                            <Left>
                                <Button transparent onPress={() => this.addDevice()}>
                                    <Icon active name="ios-checkmark-circle"/>
                                    <Text> {Config.btnDeviceOut} </Text>
                                </Button>
                            </Left>
                            <Body>
                            </Body>
                            <Right>
                                <Button onPress={() => Actions.pop()} transparent>
                                    <Icon name='ios-close-circle-outline'/>
                                    <Text> Hủy</Text>
                                </Button>
                            </Right>
                        </CardItem>

                        {/*<View style={{alignItems: 'center', width: '100%'}}>*/}
                        {/*<Button bordered onPress={() => this.login()}>*/}
                        {/*<Text style={{color: '#fdfdfd'}}> {Config.btnAddDevice} </Text>*/}
                        {/*</Button>*/}

                        {/*</View>*/}
                    </Card>

                </Content>

            </Container>
        );
    }


    async addDevice() {

        var customer_id = this.state.customer_id;
        if (customer_id == null || customer_id == '') {
            this.setState({hasError: true, errorText: 'Cần chọn khách hàng xuất'});
            return;
        }
        try {
            this.setState({isLoading: true});
            var newStage = this._switchStage(this.state.stateName);
            console.log("this.state.this.state.deviceInfo.id-----------" + this.state.deviceInfo.id);
            this.setState({newStage: newStage, oldStage: this.state.deviceInfo.stage});
            this._actionChangeStage(this.state.deviceInfo.id, newStage);
        } catch (error) {
            this.setState({isLoading: false});
            console.error(error);
        }
    }

    _actionChangeStage(id, newState) {
        try {

            console.log('--------------id ' + id + "---newState  " + newState);
            // Connect to Odoo
            global.odooAPI.connect(this._resConnect.bind(this));

            var codeDevice = this.state.textDetect;
            var params = {
                stage: newState,
                p_customer: this.state.customer_id,
                warehouse: Config.warehouseKhoKhachHang
            }; //params
            global.odooAPI.update('p.equipment', id, params, this._getResUpdate.bind(this)); //update stage
        } catch (e) {
            console.log(e);
            alert('Chuyển trạng thái bình ' + this.state.textDetect + ' thất bại! ');
            this.setState({isLoading: false});
        }
    }
    _resConnect(err){
        if (err) {
            this.setState({isLoading: false});
            console.log('--------------connect error');
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

    _createOrder(customerId) {
        try {
            var oldStage = this.state.oldStage;
            var dateTime = new Date().toISOString();
            var dateStr = dateTime.split('T')[0].replace(/-/g, '').replace(/:/g, '')
            var dateTimeStr = dateTime.split('.')[0].replace('T', '_').replace(/-/g, '').replace(/:/g, '');

            var orderCode = '';
            var orderCustomerId = this.state.customer_id;
            var orderType = '';
            var device_id = this.state.deviceInfo.id;
            var device_code = this.state.deviceInfo.code;
            //TYPE = [(0, 'Không xác định'), (1, 'Thu hồi'), (2, 'Xuất tái nạp'), (3, 'Nhập kho'), (4, 'Xuất cho khách')]


            // Connect to Odoo
            global.odooAPI.connect(this._resConnect.bind(this));
            var params = {
                p_equipments: [(6, 0, this.state.deviceInfo.id)],
                type: Config.orderType4XuatChoKhach,
                code: dateTimeStr + 'Xuat_cho_khach_' + device_code,
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
            this.setState({isLoading: false});
            alert(err);
            return console.log(err);
        }
        console.log('_______response__create_________________');
        console.log(response);
        try {
            this.setState({isLoading: false});
            if (response) {
                alert('Chuyển trạng thái mã bình ' + this.state.textDetect + ' từ '
                    + this._renderStatus(this.state.oldStage)
                    + ' sang ' + this._renderStatus(this.state.newStage));
                Actions.pop();
            } else {
                alert('Chuyển trạng thái mã bình ' + this.state.textDetect + ' thất bại ');
            }
        } catch (e) {
            console.log(e);
            this.setState({isLoading: false});
        }
    }

}

const styles = {
    spinnerTextStyle: {
        color: '#FFF',
        fontWeight: 'bold'
    },
};
