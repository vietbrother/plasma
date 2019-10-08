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
    Dimensions, FlatList
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
    Input, List, ListItem,
    // Text
} from 'native-base';
import {Actions} from 'react-native-router-flux';


import Text from '../../component/Text';
import Navbar from '../../component/Navbar';
import SideMenu from '../../component/SideMenu';
import SideMenuDrawer from '../../component/SideMenuDrawer';
import Colors from "../../Colors";
import Config from "../../Config";
import CustomerItem from "./CustomerItem";


export default class Customers extends Component {

    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            customers: [],
            isLoading: true,
            isSearching: false,
            error: null,
            sessionKey: null,

            extractedText: "",
            searchText: '',
            componentKey: new Date()
        };
    }

    componentDidMount() {
        // this.callApi();
        //this.getSessionKey();
    }

    componentWillMount(): void {
        this.search();
    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        this.setState({componentKey: new Date(), searchText: ''});
    }


    // _renderResult() {
    //     let items = [];
    //     for (var i = 0; i < this.state.customers.length; i++) {
    //         var item = this.state.customers[i];
    //         var key = new Date().valueOf();
    //         items.push(
    //             <CustomerItem key={key + '_' + i} customer={item}></CustomerItem>
    //         );
    //     }
    //     return items;
    //
    // }

    _renderItemResult(item) {
        var key = new Date().valueOf();
        return (
            <CustomerItem key={key} customer={item}></CustomerItem>
        );
    }

    search() {
        console.log('customer-----------------search');
        this.setState({isSearching: true});
        // this._isLoading(true, codeDevice).bind;
        let items = [];
        try {

            // Connect to Odoo
            global.odooAPI.connect(this._getResConnect.bind(this));

            var params = {
                // ids: [1, 2, 3, 4, 5],
                domain: [['name', 'like', this.state.searchText]],
                order: 'id',
                // limit: 15,
                offset: 0,
            }; //params
            var temp = [];
            global.odooAPI.search_read('p.customer', params, this._getData.bind(this)); //search_read
        } catch (e) {
            console.log(e);
            this.setState({isSearching: false});
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

    _getData(err, customers) {
        this.setState({isSearching: false});
        if (err) {
            alert(err);
            return console.log(err);
        }
        console.log(customers);
        console.log('__________________________');
        this.setState({isSearching: false, customers: customers});
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
                            key={this.state.componentKey}
                // key={new Date().valueOf()}
                // fetchData={'1'}
                            sessionLoginKey={this.props.sessionLoginKey}>
                <Container>
                    <Navbar left={left} right={right} title={Config.customerList}/>
                    <Content>
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingLeft: 10,
                            paddingRight: 10
                        }}>
                            <Item>
                                <Input
                                    placeholder="Tìm kiếm khách hàng..."
                                    // value={this.state.searchText}
                                    onChangeText={(text) => this.setState({searchText: text})}
                                    onSubmitEditing={() => this.search()}
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

                            {/*{this._renderResult()}*/}
                            <FlatList
                                style={{width: '100%'}}
                                data={this.state.customers}
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

