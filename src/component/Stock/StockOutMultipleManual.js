/**
 * This is the Main file
 **/

// React native and others libraries imports
import React, {Component} from 'react';
import {Image, Dimensions, TouchableWithoutFeedback, AsyncStorage, TextInput} from 'react-native';
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


export default class StockOutMultipleManual extends Component {

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
            customer_name: '',
            deviceInfo: {},
            customers: [],
            newStage: 0,
            oldStage: '',
            numberDeviceScan: ''
        };
    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        // var customer_id = this.state.customer_id;
        // var numberDeviceScan = this.state.numberDeviceScan;
        this.setState({customer_id: '', numberDeviceScan: ''});
    }

    componentWillMount() {
        try {
            this.setState({isLoading: true});
            // Connect to Odoo
            global.odooAPI.connect(this._getResConnect.bind(this));

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

    _getResConnect(err) {
        if (err) {
            console.log('--------------connect error');
            this.setState({isLoading: false});
            alert(Config.err_connect);
            return console.log(err);
        }
    }

    _getResSearch(err, customers) {
        this.setState({isLoading: false});
        if (err) {
            alert(err);
            return console.log(err);
        }
        console.log('==========================================');
        console.log(customers);
        console.log('__________________________');
        try {
            if (customers == null || customers.length < 1) {
                alert('Không tìm thấy thông tin khách hàng');
                return;
            }
            // this.setState({customer_id: customers[0].id});
            this.setState({customers: customers});
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
        cat.push(
            <Picker.Item key={new Date()} label={'Chọn khách hàng xuất'} value={'-1'}/>
        );
        var key = new Date();
        for (var i = 0; i < lstCustomer.length; i++) {
            cat.push(
                <Picker.Item key={key + "_" + i} label={lstCustomer[i].name} value={lstCustomer[i].id}/>
            );
        }
        return cat;
    }

    render() {
        var left = (
            <Left style={{flex: 1}}>
                <Button onPress={() => {Actions.home()}} transparent>
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
                        <CardItem>
                            <Body>
                            <Text style={styles.title}>{Config.orderNumberDevice} : </Text>
                            {/*<Input*/}
                            {/*placeholder={'Nhập ' + Config.orderNumberDevice}*/}
                            {/*onChangeText={(text) => this.setState({numberDeviceScan: text})}*/}
                            {/*/>*/}
                            <TextInput
                                placeholder={'Nhập ' + Config.orderNumberDevice}
                                underlineColorAndroid='transparent'
                                style={styles.textInputStyle}
                                keyboardType={'numeric'}
                                value={this.state.numberDeviceScan}
                                onChangeText={(text) => this.setState({numberDeviceScan: text})}
                                // keyboardType = 'number-pad'
                            />
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
                                <Button onPress={() => {Actions.home()}} transparent>
                                    <Icon name='ios-close-circle-outline'/>
                                    <Text> Hủy</Text>
                                </Button>
                            </Right>
                        </CardItem>

                    </Card>

                </Content>

            </Container>
        );
    }


    async addDevice() {


        var customer_id = this.state.customer_id;
        var numberDeviceScan = this.state.numberDeviceScan;
        console.log(customer_id);
        if (customer_id == null || customer_id == '' || customer_id == '-1') {
            this.setState({hasError: true, errorText: 'Cần chọn khách hàng xuất'});
            return;
        }
        if (numberDeviceScan == null || numberDeviceScan == '' || numberDeviceScan == '0') {
            this.setState({hasError: true, errorText: 'Cần chọn số lượng thiết bị xuất cho khách'});
            return;
        }


        try {
            var customer_name = '';
            var lstCustomer = this.state.customers;
            for (var i = 0; i < lstCustomer.length; i++) {
                if (this.state.customer_id == lstCustomer[i].id) {
                    customer_name = lstCustomer[i].name;
                    this.setState({customer_name: lstCustomer[i].name})
                }
            }
            console.log(customer_name);
            AsyncStorage.setItem(Config.keyStoreOrderDeviceOut, JSON.stringify([]));
            // Actions.manualScannerList({
            //     customer_id: customer_id,
            //     customer_name: customer_name,
            //     numberDeviceScan: numberDeviceScan
            // });

            Actions.stockInOutList({
                customer_id: customer_id,
                customer_name: customer_name,
                numberDeviceScan: numberDeviceScan,
                stockInType: Config.stage4BinhDangSuDung,
                title: Config.stockOutListStage4
            });
        } catch (error) {
            this.setState({isLoading: false});
            console.error(error);
        }
    }


}

const styles = {
    spinnerTextStyle: {
        color: '#FFF',
        fontWeight: 'bold'
    },
    textInputStyle: {
        textAlign: 'center',
        height: 40,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#009688',
        width: '100%',
        marginTop: 10
    },
    title: {
        fontSize: 16, fontWeight: 'bold'
    }
};
