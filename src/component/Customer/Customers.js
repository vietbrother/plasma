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
    Dimensions,
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
        };
    }

    componentDidMount() {
        // this.callApi();
        //this.getSessionKey();
    }

    componentWillMount(): void {
        this.search();
    }


    async getSessionKey() {
        try {
            const value = await AsyncStorage.getItem('cookieUserFromApi');
            console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
            console.log(value);
            this.setState({sessionKey: value});
            console.log("state : " + this.state.sessionKey);
            // this._fetchCategorieData();
            // this._fetchProductsData();
            this.setState({loading: false});
        } catch (error) {
            // Handle errors here
            console.error(error);
        }
    }

    _renderResult() {
        let items = [];
        for (var i = 0; i < this.state.customers.length; i++) {
            var item = this.state.customers[i];
            var key = new Date().valueOf();
            items.push(
                <View style={{
                    width: '100%', color: Config.mainColor, fontSize: 16,
                    borderBottomColor: '#7c8fb7', borderBottomWidth: 0.5,
                    paddingLeft: 10,
                    paddingTop: 20, paddingBottom: 20
                }}>
                    <TouchableOpacity
                        onPress={() => Actions.customerDetail({customer: item})}
                        activeOpacity={0.9}
                    >
                        <Text style={{fontSize: 16, fontWeight: 'bold'}}>{item.name}</Text>
                        <Text style={{textAlign: 'left'}}>
                            <Icon active name='ios-pin' style={{fontSize: 14, color: "#687373", paddingRight: 5}} />
                            {item.address}
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        }
        return items;

    }

    search() {
        console.log('customer-----------------search');
        this.setState({isSearching: true});
        // this._isLoading(true, codeDevice).bind;
        let items = [];
        try {

            // Connect to Odoo
            global.odooAPI.connect(function (err) {
                if (err) {
                    console.log('--------------connect error');
                    alert(Config.err_connect)
                    this.setState({isLoading: false});
                    return console.log(err);
                }
            });

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

    _getData(err, customers) {
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

