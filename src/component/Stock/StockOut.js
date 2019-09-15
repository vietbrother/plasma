/**
 * This is the Main file
 **/

// React native and others libraries imports
import React, {Component} from 'react';
import {Image, Dimensions, TouchableWithoutFeedback, AsyncStorage} from 'react-native';
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
            stateName: '',
            warehouse: '',
            createDate: new Date(),
            customer_id: '',
            customers: []
        };
    }

    componentWillMount() {
        this.setState({textDetect: this.props.textDetect, code: this.props.textDetect});
        this.setState({stateName: this.props.stateName, warehouse: this.props.warehouse});

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
                domain: [],
                fields: ['id', 'name', 'address'],
                order: 'name',
                limit: 15,
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
            this.setState({isLoading: false, customers: products});
        } catch (e) {
            console.log(e);
            this.setState({isLoading: false, customers: []});
        }
    }



    onValueChangeStateName(value: string) {
        this.setState({
            stateName: value
        });
    }

    onValueChangeWarehouse(value: string) {
        this.setState({
            warehouse: value
        });
    }

    setDate(newDate) {
        this.setState({createDate: newDate});
    }

    onValueChangeCustomer(value: string) {
        this.setState({
            customer_id: value
        });
    }

    renderListCustomer() {
        let cat = [];
        var lstCustomer = this.state.customers;
        for (var i = 0; i < lstCustomer.length; i++) {
            cat.push(
                <Picker.Item label={lstCustomer[i].name} value={lstCustomer[i].id} />
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
                <Navbar left={left} right={right} title="Nhập thiết bị"/>
                <Content contentContainerStyle={{
                    paddingHorizontal: 10,
                    backgroundColor: '#f3f9ff'
                }}>
                    <Card transparent>
                        <CardItem header bordered>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Nhập thiết bị</Text>
                        </CardItem>
                        <CardItem>
                            <Body>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Mã nhận diện
                                : {this.state.textDetect}</Text>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Body>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Mã thiết bị : </Text>
                            <Input
                                placeholder={this.state.code}
                                onChangeText={(text) => this.setState({code: text})}
                                // onSubmitEditing={() => this.search(this.state.searchText)}
                                // style={{marginTop: 9}}
                            />
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Body>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Trạng thái : </Text>
                            <Picker
                                note
                                mode="dropdown"
                                style={{width: 120}}
                                selectedValue={this.state.stateName}
                                onValueChange={this.onValueChangeStateName.bind(this)}
                            >
                                <Picker.Item label="Không xác định" value="0"/>
                                <Picker.Item label="Vỏ" value="1"/>
                                <Picker.Item label="Tái nạp" value="2"/>
                                <Picker.Item label="Bình tồn" value="3"/>
                                <Picker.Item label="Bình đang sử dụng" value="4"/>
                            </Picker>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Body>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Kho : </Text>
                            <Picker
                                note
                                mode="dropdown"
                                style={{width: 120}}
                                selectedValue={this.state.warehouse}
                                onValueChange={this.onValueChangeWarehouse.bind(this)}
                            >
                                <Picker.Item label="Không xác định" value="0"/>
                                <Picker.Item label="Kho công ty" value="1"/>
                                <Picker.Item label="Kho nhà máy" value="2"/>
                                <Picker.Item label="Kho khách hàng" value="3"/>
                            </Picker>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Body>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Khách hàng : </Text>
                            <Picker
                                note
                                mode="dropdown"
                                style={{width: 120}}
                                selectedValue={this.state.warehouse}
                                onValueChange={this.onValueChangeCustomer.bind(this)}
                            >
                                {this.renderListCustomer()}
                            </Picker>
                            </Body>
                        </CardItem>


                        <CardItem>
                            <Body>
                            <Text style={{}}>Ngày nhập : </Text>
                            <DatePicker
                                defaultDate={this.state.createDate}
                                // minimumDate={new Date(2018, 1, 1)}
                                // maximumDate={new Date(2018, 12, 31)}
                                locale={"en"}
                                timeZoneOffsetInMinutes={undefined}
                                modalTransparent={false}
                                animationType={"fade"}
                                androidMode={"default"}
                                placeHolderText="Chọn ngày"
                                textStyle={{color: "green"}}
                                placeHolderTextStyle={{color: "#d3d3d3"}}
                                onDateChange={this.setDate}
                                disabled={false}
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
                                <Button bordered onPress={() => this.addDevice()}>
                                    <Text style={{color: '#fdfdfd'}}> {Config.btnAddDevice} </Text>
                                </Button>
                            </Left>
                            <Body>
                            {/*<Button transparent>*/}
                                {/*<Icon active name="chatbubbles"/>*/}
                                {/*<Text>4 Comments</Text>*/}
                            {/*</Button>*/}
                            </Body>
                            <Right>
                                <Button onPress={() => Actions.pop()} transparent>
                                    <Text><Icon name='ios-arrow-back'/> Hủy</Text>
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

        var stateName = this.state.stateName;
        var warehouse = this.state.warehouse;
        if (stateName == null || stateName == '') {
            this.setState({hasError: true, errorText: 'Cần nhập trạng thái'});
            return;
        }
        if (warehouse == null || warehouse == '') {
            this.setState({hasError: true, errorText: 'Cần nhập kho'});
            return;
        }
        try {
            this.setState({isLoading: true});

            console.log(statusLogin);
        } catch (error) {
            this.setState({isLoading: false});
            console.error(error);
        }
        //
        // if (statusLogin == 'ok') {
        //     Actions.home({sessionLoginKey: sessionLoginKey});
        // } else {
        //     this.setState({hasError: true, errorText: 'Tên đăng nhập hoặc mật khẩu không đúng'});
        // }

        Actions.pop();
    }


}

const styles = {
    spinnerTextStyle: {
        color: '#FFF',
        fontWeight: 'bold'
    },
};
