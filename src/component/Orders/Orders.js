/**
 * This is the Home page
 **/

// React native and others libraries imports
import React, {Component} from 'react';
import {
    Image,
    ActivityIndicator,
    AsyncStorage,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    NativeModules,
    Dimensions, FlatList,
} from 'react-native';
import {
    Container,
    Content,
    View,
    Button,
    Left,
    Right,
    Icon,
    Card,
    CardItem,
    cardBody,
    Row,
    Grid,
    Col,
    Item,
    Input, List, ListItem, Body, DatePicker,
    // Text
} from 'native-base';
import {Actions} from 'react-native-router-flux';


import Text from '../../component/Text';
import Navbar from '../../component/Navbar';
import SideMenu from '../../component/SideMenu';
import SideMenuDrawer from '../../component/SideMenuDrawer';
import Colors from "../../Colors";
import Config from "../../Config";
import HTML from 'react-native-render-html';
import OrderItem from "./OrderItem";


export default class Orders extends Component {

    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            orders: [],
            isLoading: true,
            isSearching: false,
            error: null,
            sessionKey: null,

            extractedText: "",
            searchText: '',
            componentKey: new Date(),
            fromDate: new Date(new Date() - 14*24*60*60*1000),
            toDate: new Date(),
        };
    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        this.setState({componentKey: new Date(), searchText: ''});
    }

    componentDidMount() {
        //Get today's date using the JavaScript Date object.
        var date = new Date();
        date.setDate(date.getDate() - 14);
        console.log("___________________________________");
        console.log(date);
        this.setState({fromDate: date});
        console.log(this.state.fromDate);

        this.search();
    }

    // componentWillMount(): void {
    //     //Get today's date using the JavaScript Date object.
    //     var date = new Date();
    //     date.setDate(date.getDate() - 14);
    //     console.log("___________________________________");
    //     console.log(date);
    //     this.setState({fromDate: date});
    //     console.log(this.state.fromDate);
    //     console.log("___________________________________componentWillMount");
    // }

    // _renderResult() {
    //     let items = [];
    //     for (var i = 0; i < this.state.orders.length; i++) {
    //         var item = this.state.orders[i];
    //         var key = new Date().valueOf();
    //         console.log(item);
    //         items.push(
    //             <OrderItem key={key + '_' + i} order={item}></OrderItem>
    //         );
    //     }
    //     return items;
    //
    // }

    _renderItemResult(item) {
        var key = new Date().valueOf();
        return (
            <OrderItem key={key} order={item}></OrderItem>
        );
    }


    search() {
        console.log('Orders-----------------search');
        this.setState({isSearching: true});
        let items = [];
        try {
            // Connect to Odoo
            global.odooAPI.connect(this._getResConnect.bind(this));

            var fromDate = this.state.fromDate;
            console.log(fromDate);
            fromDate = fromDate.toLocaleDateString();
            var toDate = this.state.toDate;
            console.log(toDate);
            toDate = toDate.toLocaleDateString();
            console.log(fromDate);
            console.log(toDate);
            var params = {
                // ids: [1, 2, 3, 4, 5],
                domain: [['code', 'like', this.state.searchText], ['type', '=', Config.orderType4XuatChoKhach],
                    ['create_date', '>=', fromDate], ['create_date', '<=', toDate]
                ],
                // fields: ['id', 'code', 'stage', 'warehouse', 'p_customer', 'description'],
                order: 'create_date desc',
                // limit: 15,
                offset: 0,
            }; //params
            global.odooAPI.search_read('p.order', params, this._getData.bind(this)); //search_read
        } catch (e) {
            console.log(e);
            this.setState({isSearching: false});
        }
    }

    _getResConnect(err) {
        if (err) {
            console.log('--------------connect error');
            this.setState({isSearching: false});
            alert(Config.err_connect);
            return console.log(err);
        }
    }

    _getData(err, orders) {
        this.setState({isSearching: false});
        if (err) {
            alert(err);
            return console.log(err);
        }
        // console.log(orders);
        console.log('__________orders________________');
        this.setState({orders: orders});
    }

    setFromDate(newDate) {
        this.setState({fromDate: newDate});
    }

    setToDate(newDate) {
        this.setState({toDate: newDate});
    }


    _getFormattedDate(date) {
        var month = date .getMonth() + 1;
        var day = date .getDate();
        var year = date .getFullYear();
        return day + "/" + month + "/" + year;
    }

    render() {
        var left = (
            <Left style={{flex: 1}}>
                <Button onPress={() => this._sideMenuDrawer.open()} transparent>
                    <Icon name='ios-menu-outline'/>
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
            <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref}
                // key={new Date().valueOf()}
                            key={this.state.componentKey}
                // fetchData={'1'}
                // sessionLoginKey={this.props.sessionLoginKey}
            >
                <Container>
                    <Navbar left={left} right={right} title={Config.orderList}/>
                    <Content>
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingLeft: 10,
                            paddingRight: 10
                        }}>
                            <Item>
                                <Grid>
                                    <Col>
                                        <CardItem>
                                            <Body>
                                            <Text style={{}}>Từ ngày  </Text>
                                            <DatePicker
                                                defaultDate={this.state.fromDate}
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
                                                onDateChange={this.setFromDate.bind(this)}
                                                disabled={false}
                                            />
                                            </Body>
                                        </CardItem>
                                    </Col>
                                    <Col>
                                        <CardItem>
                                            <Body>
                                            <Text style={{}}>Đến ngày  </Text>
                                            <DatePicker
                                                defaultDate={this.state.toDate}
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
                                                onDateChange={this.setToDate.bind(this)}
                                                disabled={false}
                                            />
                                            </Body>
                                        </CardItem>
                                    </Col>
                                </Grid>
                            </Item>
                            <Item>
                                <Input
                                    placeholder="Tìm kiếm đơn hàng..."
                                    // value={this.state.searchText}
                                    onChangeText={(text) => this.setState({searchText: text})}
                                    onSubmitEditing={() => this.search(this.state.searchText)}
                                    // style={{marginTop: 9}}
                                />
                                <Icon name="ios-search" style={Config.mainColor}
                                      onPress={() => this.search(this.state.searchText)}/>
                            </Item>
                            <ActivityIndicator
                                animating={this.state.isSearching}
                                color={Config.mainColor}
                                size="large"
                            />
                            {/*{this._renderResult()}*/}
                            <FlatList
                                style={{width: '100%'}}
                                data={this.state.orders}
                                renderItem={({item}) => this._renderItemResult(item)}
                            />
                        </View>

                    </Content>
                </Container>
            </SideMenuDrawer>);
    }


}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
    },
    scrollContainer: {
        // height: 150,
        marginTop: 5,
        paddingRight: 5,
        paddingLeft: 5,
        paddingBottom: 20
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 10,
        marginRight: 5,
        borderColor: '#dfe3ee',
        borderWidth: 0.5
    },
    capturePhoto: {
        width: 120,
        height: 120,
        borderRadius: 10,
        // marginRight: 5,
        borderColor: '#dfe3ee',
        borderWidth: 0.5
    },

    line: {
        width: '47%',
        height: 3,
        backgroundColor: '#7f8c8d',
        position: 'absolute',
        bottom: '0%',
        marginLeft: 5
    },
    titleView: {
        flex: 1, width: '97%',
        backgroundColor: Config.mainColor,
        borderRadius: 5,
        borderWidth: 0.5,
        margin: 5,
    },
    title: {
        fontSize: 16, fontFamily: 'Roboto',
        fontWeight: '200',
        color: 'white',
        margin: 10,
    },
    icon: {
        fontSize: 13
    },
    stage0: {
        color: '#ffa505'
    },
    stage1: {
        color: Config.colorThin
    },
    stage2: {
        color: '#ff00ff'
    },
    stage3: {
        color: '#c40521'
    },
    stage4: {
        color: '#44bc37'
    },
});

const _styles = {
    font: {
        fontFamily: 'Roboto',
        color: Colors.navbarBackgroundColor
    },
    icon: {
        fontSize: 13
    },
    stage0: {
        color: '#ffa505'
    },
    stage1: {
        color: Config.colorThin
    },
    stage2: {
        color: '#ff00ff'
    },
    stage3: {
        color: '#c40521'
    },
    stage4: {
        color: '#44bc37'
    },

};

