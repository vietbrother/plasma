/**
 * This is the Main file
 **/

// React native and others libraries imports
import React, {Component} from 'react';
import {Image, Dimensions, TouchableWithoutFeedback, AsyncStorage, FlatList} from 'react-native';
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
import DeviceItem from "../Device/DeviceItem";
import Colors from "../../Colors";


export default class OrderDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            errorText: '',
            isLoading: false,

            code: '',
            create_date: '',
            p_customer: [],
            p_equipments: [],
            deviceList: [],
        };
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.setState({
            code: this.props.order.code == null || this.props.order.code == false ? 'Không có' : this.props.order.code,
            create_date: this.props.order.create_date,
            p_customer: this.props.order.p_customer,
            p_equipments: this.props.order.p_equipments
        });
        console.log(this.props.order);
        console.log(this.props.order.p_equipments);
        console.log(this.props.order.p_equipments.length);
        console.log(this.state.p_equipments);
        if (this.props.order.p_equipments != null && this.props.order.p_equipments.length > 0) {
            this.search();
        }
    }

    search() {
        console.log('order detail-----------------search');
        this.setState({isLoading: true});
        let items = [];
        try {
            // Connect to Odoo
            global.odooAPI.connect(function (err) {
                if (err) {
                    this.setState({isLoading: false});
                    console.log('--------------connect error');
                    alert(Config.err_connect)
                    return console.log(err);
                }
            });

            var params = {
                // ids: [1, 2, 3, 4, 5],
                domain: [['id', 'in', this.props.order.p_equipments]],
                fields: ['id', 'code', 'stage', 'warehouse', 'p_customer', 'description'],
                order: 'id',
                limit: 15,
                offset: 0,
            }; //params
            global.odooAPI.search_read('p.equipment', params, this._getData.bind(this)); //search_read
        } catch (e) {
            console.log(e);
            this.setState({isLoading: false});
        }
    }

    _getData(err, products) {
        if (err) {
            this.setState({isLoading: false});
            alert(err);
            return console.log(err);
        }
        console.log(products);
        console.log('__________________________');
        this.setState({isLoading: false, deviceList: products});
    }

    // _renderListDevice() {
    //     let items = [];
    //     if (this.state.deviceList.length > 0) {
    //         for (var i = 0; i < this.state.deviceList.length; i++) {
    //             var item = this.state.deviceList[i];
    //             var key = new Date().valueOf();
    //             console.log(item);
    //             items.push(
    //                 <DeviceItem key={key + '_' + i} device={item}></DeviceItem>
    //             );
    //         }
    //     } else {
    //         items.push(
    //             <Text>Không có thiết bị</Text>
    //         );
    //     }
    //
    //     return items;
    //
    // }
    _renderItemResult(item) {
        var key = new Date().valueOf();
        return (
            <View style={{
                flex: 1,
                width: '100%', color: Config.mainColor, fontSize: 16,
                borderBottomColor: Colors.navbarBackgroundColor, borderBottomWidth: 0.5,
                paddingLeft: 10,
                paddingTop: 20, paddingBottom: 20
            }}>
                <DeviceItem key={key} device={item}></DeviceItem>
            </View>
        );
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
                <Navbar left={left} right={right} title={Config.orderDetail}/>
                <Content contentContainerStyle={{
                    paddingHorizontal: 10,
                    backgroundColor: '#f3f9ff'
                }}>
                    <Card transparent>
                        <CardItem header bordered>
                            <Text style={{fontSize: 20, fontWeight: 'bold'}}>{Config.orderDetail}</Text>
                        </CardItem>

                        <CardItem>
                            <Body>
                            <Text style={styles.title}>{Config.orderCode} : </Text>
                            <Text>
                                {this.state.code}
                            </Text>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Body>
                            <Text style={styles.title}>{Config.orderDate} : </Text>
                            <Input
                                value={this.state.create_date}
                            />
                            </Body>
                        </CardItem>

                        <CardItem>
                            <Body>
                            <Text style={styles.title}>{Config.orderCustomer} : </Text>
                            <Input
                                value={this.state.p_customer == null
                                || this.state.p_customer == false
                                || this.state.p_customer.length < 2 ? 'Chưa có' : this.state.p_customer[1]}
                            />
                            </Body>
                        </CardItem>

                        <CardItem header bordered>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>{Config.orderListDevice}</Text>
                        </CardItem>
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingLeft: 10,
                            paddingRight: 10,
                            backgroundColor: 'white'
                        }}>
                            {/*{this._renderListDevice()}*/}
                            <FlatList
                                style={{width: '100%'}}
                                data={this.state.deviceList}
                                renderItem={({item}) => this._renderItemResult(item)}
                            />
                        </View>

                        <CardItem>
                            <Left>
                                {/*<Button bordered onPress={() => this.add()}>*/}
                                {/*<Text style={{color: '#fdfdfd'}}> {Config.customerAddTitle} </Text>*/}
                                {/*</Button>*/}
                            </Left>
                            <Body>
                            {/*<Button transparent>*/}
                            {/*<Icon active name="chatbubbles"/>*/}
                            {/*<Text>4 Comments</Text>*/}
                            {/*</Button>*/}
                            </Body>
                            <Right>
                                <Button active onPress={() => Actions.pop()} transparent>
                                    <Text><Icon name='ios-arrow-back'/> {Config.btnClose}</Text>
                                </Button>
                            </Right>
                        </CardItem>

                    </Card>

                </Content>

            </Container>
        );
    }


}

const styles = {
    spinnerTextStyle: {
        color: '#FFF',
        fontWeight: 'bold'
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold'
    }
};
